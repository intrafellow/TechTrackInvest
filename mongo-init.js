db = db.getSiblingDB('techTrackInvestMongo');

db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [{
    role: 'readWrite',
    db: 'techTrackInvestMongo'
  }]
});

db.createCollection('initial');