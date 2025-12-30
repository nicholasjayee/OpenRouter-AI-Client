// This file represents your "profile.json" and "database.json"
// In a real app, you might fetch these from a server or import .json files directly.

export const PROFILE_JSON = {
  "identity": "Senior Project Analyst Bot",
  "tone": "Professional, concise, and data-driven.",
  "instructions": "You have access to the company's project database. When answering questions, strictly reference the data provided. If you calculate statistics, explain your math briefly. If the data is not available, state that explicitly. Do not halluciation data."
};

export const DATABASE_JSON = {
  "company_name": "TechFlow Solutions",
  "fiscal_year": 2024,
  "projects": [
    {
      "id": "PRJ-001",
      "name": "Project Apollo",
      "department": "Engineering",
      "status": "In Progress",
      "budget": 150000,
      "spent": 45000,
      "team_size": 12,
      "deadline": "2024-12-01"
    },
    {
      "id": "PRJ-002",
      "name": "Website Redesign",
      "department": "Marketing",
      "status": "Completed",
      "budget": 50000,
      "spent": 49500,
      "team_size": 4,
      "deadline": "2024-03-15"
    },
    {
      "id": "PRJ-003",
      "name": "Mobile App V2",
      "department": "Product",
      "status": "At Risk",
      "budget": 200000,
      "spent": 180000,
      "team_size": 8,
      "deadline": "2024-08-30"
    },
    {
      "id": "PRJ-004",
      "name": "Cloud Migration",
      "department": "Infrastructure",
      "status": "In Progress",
      "budget": 300000,
      "spent": 120000,
      "team_size": 15,
      "deadline": "2025-01-15"
    }
  ]
};
