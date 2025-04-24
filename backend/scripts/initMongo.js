db = connect("mongodb://localhost:27017/techTrackInvestMongo");


db.articles.drop();
db.niches.drop();
db.conferences.drop();
db.contracts.drop();
db.solutions.drop();
db.crises.drop();
db.startups.drop();

db.articles.insertOne({
  _id: "article-1",
  title: "Top 10 Energy Startups",
  content: "Here are the most promising startups in the green energy niche..."
});

db.niches.insertMany([
  {
  _id: "niche-1",
  name: "GreenTeck"},
  {
    _id: "niche-2",
    name: "MedTeck"
  },
  {
    _id: "niche-3",
    name: "SpaceTeck"
  },
  {
    _id: "niche-4",
    name: "IT"
  }
]);

db.conferences.insertOne({
  _id: "conf-1",
  name: "Future Energy Forum",
  description: "Discussing trends in renewable energy.",
  niche: "niche-1",
  enrollPrice: 200,
  gainedReputation: 50,
  expertise: [
    {
      nicheId: "niche-1",
      change: 10
    }
  ]
});

db.contracts.insertOne({
  _id: "contract-1",
  startupId: "startup-1",
  minPrice: 1000,
  maxPrice: 3000,
  teamEffect: 2,
  reputationEffect: 5
});

const solution = {
  _id: "solution-1",
  title: "Government Grant",
  description: "Get support from the government to mitigate crisis impact.",
  effect: {
    price: -500,
    expenses: -200,
    team: -1,
    product: 3,
    reputation: 10
  }
};
db.solutions.insertOne(solution);

db.crises.insertOne({
  _id: "crisis-1",
  name: "Solar Panel Shortage",
  description: "Shortage in raw materials impacts solar panel production.",
  danger: 3,
  niches: ["niche-1"],
  possibleSolutions: [solution]
});

db.startups.insertOne({
  _id: "startup-1",
  name: "SunPower",
  description: "Efficient solar panels for residential use.",
  price: 5000,
  uniqueProductOffer: "High-efficiency cells with lower cost.",
  lastMonthRevenue: 10000,
  expenses: 3000,
  team: 10,
  budget: 15000,
  product: 7,
  reputation: 80,
  level: 2,
  stage: "MVP",
  niche: "niche-1"
});
