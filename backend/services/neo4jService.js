import neo4jConnect from '../config/neo4j.js';

class Neo4jService {
  constructor() {
    this.driver = null;
  }

  async init() {
    this.driver = await neo4jConnect();
  }

  /**
   * Crée un nœud Emergency et calcule les distances avec les hôpitaux
   */
  async createEmergencyNodeAndCalculateDistances(emergencyData) {
    const session = this.driver.session();
    try {
      const result = await session.executeWrite(async tx => {
        const createQuery = `
          CREATE (e:Emergency {
            id: $emergencyId,
            latitude: $latitude,
            longitude: $longitude,
            phoneNumber: $phoneNumber,
            status: 'pending',
            timestamp: datetime()
          })
          RETURN e
        `;

        await tx.run(createQuery, {
          emergencyId: emergencyData._id.toString(),
          latitude: emergencyData.location.coordinates[1],
          longitude: emergencyData.location.coordinates[0],
          phoneNumber: emergencyData.phoneNumber
        });

        let allHospitals = new Set();
        let nearbyHospitals = [];
        let radius = 500;
        const step = 500;
        const maxRadius = 5000;
        let stop = false;

        while (!stop && radius <= maxRadius) {
          const distanceQuery = `
            MATCH (e:Emergency {id: $emergencyId})
            MATCH (h:Hospital)
            WITH e, h, 
            point.distance(
              point({ latitude: e.latitude, longitude: e.longitude }),
              point({ latitude: h.latitude, longitude: h.longitude })
            ) AS distance
            WHERE distance <= $radius
            RETURN h.id as hospitalId, distance
            ORDER BY distance ASC
          `;

          const res = await tx.run(distanceQuery, {
            emergencyId: emergencyData._id.toString(),
            radius
          });

          const newlyFound = [];
          let hospitalsFoundInRadius = 0;

          for (const record of res.records) {
            const hospitalId = record.get('hospitalId');

            if (!allHospitals.has(hospitalId)) {
              allHospitals.add(hospitalId);
              const distance = record.get('distance');
              newlyFound.push({ hospitalId, distance });
              nearbyHospitals.push({ hospitalId, distance });

              await tx.run(`
                MATCH (e:Emergency {id: $emergencyId}), (h:Hospital {id: $hospitalId})
                CREATE (e)-[:DISTANCE_TO {meters: $distance}]->(h)
              `, {
                emergencyId: emergencyData._id.toString(),
                hospitalId,
                distance
              });
            }
          }

          console.log(`🏥 Hôpitaux trouvés à ${radius} mètres :`, newlyFound);

          if (hospitalsFoundInRadius ===0){
            console.log(`Aucun hôpital trouvé à ${radius} mètres, elargissement du rayon...`);
          }
          radius += step;

          
        }

        return {
          emergency: {
            id: emergencyData._id.toString(),
            latitude: emergencyData.location.coordinates[1],
            longitude: emergencyData.location.coordinates[0]
          },
          nearbyHospitals
        };
      });

      return result;
    } catch (error) {
      console.error('Erreur Neo4j:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
}

export default Neo4jService;
