# Yara / Stock Management Application

### Development Scenario

A customer manages multiple warehouses and requires a system to track stock movements within each warehouse. Warehouses have specific sizes, representing the maximum allowable stock. Products, which can be hazardous or non-hazardous, are stored in these warehouses. The application records the import and export of products, including details such as product, quantity, and date. Import operations can be in the past or future. It is crucial to avoid storing hazardous and non-hazardous products in the same warehouse. The customer needs to view current stock levels, available stock space, and historical import/export data.

### Technologies Used

- TypeScript
- GraphQL (Apollo Server) / NestJS
- PostgreSQL / Docker
- REST API / NestJS

## How to start

1. Install Docker on your machine.
2. Navigate to the root of the repository.
3. Run `nvm use` to switch to the proper node version (refer to the `.nvrmrc` for the node version).
4. Run `npm i` to install all the dependencies.
5. Run `docker compose up -d` to start the postgres container.
6. Run `npm run start:dev` to start both gql & calculations servers (ports: 3000 & 3001).
7. Run `npm run seed` to seed the database if needed.
8. Start a browser and navigate to the [gql playground](http://localhost:3000/graphql) to run your queries & mutations (refer to the playground docs for detailed information).
9. (Optional) You can use [Postbird](https://github.com/Paxa/postbird) as a PostgreSQL GUI client for easier testing.
