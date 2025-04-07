## Frontend Setup Instructions

### Install Dependencies
To install all required dependencies, run the following command:

```bash
npm instal
```

### Build the Project
To build the project, use the following command:
```
npm run build
```

### Preview the Project
To preview the production build locally, run:
```
npm run preview
```

### Configuration
The application uses a .env file to manage environment-specific configurations. This includes:

- **VITE_BASE_URL:** The base URL for the backend API. This should be updated if the API endpoint changes.

- **VITE_TENANT_ID:** A unique tenant identifier in GUID format. This is crucial for multi-tenancy support.

Ensure that the TENANT_ID provided is a valid GUID. Although no additional information is stored about a tenant, this ID is essential for data segregation.

Each event created is associated with a tenant ID, and all subsequent requests will filter and return only those events that match the current tenant’s ID. This helps maintain data isolation across tenants.
