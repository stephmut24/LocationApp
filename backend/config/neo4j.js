import neo4j from 'neo4j-driver';

const neo4jConnect = async () => {
  try {
    console.log('Tentative de connexion à Neo4j...');
    console.log('URI:', process.env.NEO4J_URI);
    console.log('User:', process.env.NEO4J_USER);
    
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );

    // Vérifier la connexion
    const serverInfo = await driver.getServerInfo();
    console.log('Neo4j connecté à la version:', serverInfo.protocolVersion);
    
    return driver;
  } catch (error) {
    console.error('Détails erreur Neo4j:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

export default neo4jConnect;