import neo4jConnect from '../config/neo4j.js';
import syncMongoToNeo4j from './syncMongoToNeo4j.js';

class Neo4jService {
  constructor() {
    this.driver = null;
  }

  async init() {
    this.driver = await neo4jConnect();
    await syncMongoToNeo4j();
    console.log('Synchronisation MongoDB vers Neo4j terminée');
    console.log('✅ Neo4jService initialisé avec succès');
  }

  /**
   * Partie 1 – Création simple de l'urgence (vue du patient)
   */
  async createEmergencyNode(emergencyData) {
    const session = this.driver.session();
    try {
      await session.executeWrite(async tx => {
        const createQuery = `
          CREATE (e:Emergency {
            id: $emergencyId,
            latitude: $latitude,
            longitude: $longitude,
            phoneNumber: $phoneNumber,
            status: 'pending',
            timestamp: datetime()
          })
        `;
        await tx.run(createQuery, {
          emergencyId: emergencyData._id.toString(),
          latitude: emergencyData.location.coordinates[1],
          longitude: emergencyData.location.coordinates[0],
          phoneNumber: emergencyData.phoneNumber
        });
      });

      // Démarrer la suite en arrière-plan (non bloquant)
      this.processEmergency(emergencyData);

      return { message: 'Urgence enregistrée avec succès.' };

    } catch (error) {
      console.error('Erreur création urgence:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * Partie 2 – Traitement interne (hôpitaux + ambulances)
   */
  async processEmergency(emergencyData) {
    const session = this.driver.session();
    try {
      const emergencyId = emergencyData._id.toString();
      const latitude = emergencyData.location.coordinates[1];
      const longitude = emergencyData.location.coordinates[0];

      await session.executeWrite(async tx => {
        const radius = 5000;
        const nearbyHospitals = [];

        const distanceQuery = `
          MATCH (e:Emergency {id: $emergencyId})
          MATCH (h:Hospital)
          WITH e, h,
          point.distance(
            point({ latitude: e.latitude, longitude: e.longitude }),
            point({ latitude: h.latitude, longitude: h.longitude })
          ) AS distance
          WHERE distance <= $radius
          RETURN h.id AS hospitalId, distance
          ORDER BY distance ASC
          LIMIT 5
        `;

        const res = await tx.run(distanceQuery, {
          emergencyId,
          radius
        });

        for (const record of res.records) {
          const hospitalId = record.get('hospitalId');
          const distance = record.get('distance');

          nearbyHospitals.push({ hospitalId, distance });

          await tx.run(`
            MATCH (e:Emergency {id: $emergencyId}), (h:Hospital {id: $hospitalId})
            CREATE (e)-[:DISTANCE_TO {meters: $distance}]->(h)
          `, {
            emergencyId,
            hospitalId,
            distance
          });
        }

        console.log('✅ Hôpitaux proches traités en arrière-plan');

        // Recherche ambulance disponible la plus proche
        const hospitalIds = nearbyHospitals.map(h => h.hospitalId);

        const ambulanceQuery = `
          MATCH (e:Emergency {id: $emergencyId})
          MATCH (h:Hospital)<-[:BELONGS_TO]-(a:Ambulance)
          WHERE h.id IN $hospitalIds AND a.status = "available"
          WITH e, a,
          point.distance(
            point({latitude: a.latitude, longitude: a.longitude}),
            point({latitude: e.latitude, longitude: e.longitude})
          ) AS distance
          RETURN a.id AS ambulanceId, a.latitude AS lat, a.longitude AS lng, distance
          ORDER BY distance ASC
          LIMIT 1
        `;

        const ambulanceResult = await tx.run(ambulanceQuery, {
          emergencyId,
          hospitalIds
        });

        if (ambulanceResult.records.length > 0) {
          const record = ambulanceResult.records[0];
          const ambulanceId = record.get('ambulanceId');

          await tx.run(`
            MATCH (a:Ambulance {id: $ambulanceId})
            SET a.status = "dispatched"
          `, { ambulanceId });

          await tx.run(`
            MATCH (a:Ambulance {id: $ambulanceId}), (e:Emergency {id: $emergencyId})
            CREATE (a)-[:ASSIGNED_TO]->(e)
          `, { ambulanceId, emergencyId });

          console.log(`🚑 Ambulance ${ambulanceId} assignée à l'urgence ${emergencyId}`);
        } else {
          console.log('⚠️ Aucune ambulance disponible trouvée.');
        }
      });
    } catch (error) {
      console.error('Erreur dans le traitement en arrière-plan:', error);
    } finally {
      await session.close();
    }
  }
}

export default Neo4jService;
