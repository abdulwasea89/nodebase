try {
    const auth0Server = require('@auth0/nextjs-auth0/server');
    console.log('Server:', Object.keys(auth0Server));
} catch (e) {
    console.log('Server import failed');
}
try {
    const auth0Edge = require('@auth0/nextjs-auth0/edge');
    console.log('Edge:', Object.keys(auth0Edge));
} catch (e) {
    console.log('Edge import failed');
}
