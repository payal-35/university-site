const fetch = require('node-fetch');

const API_KEY = 'arc_live_cbb9cecb070b6ebeda1ba066bb9beacd';

async function listForms() {
  try {
    const res = await fetch('https://arcompli.com/api/v1/forms', {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    
    console.log(`GET /forms status: ${res.status}`);
    const text = await res.text();
    console.log(`GET /forms body: ${text}`);
    
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

listForms();
