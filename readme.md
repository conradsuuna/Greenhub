# Assignment API

A TypeScript-based backend API with PostgreSQL database integration.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)

## Features

- TypeScript-based backend API
- PostgreSQL database integration using Prisma ORM
- Express.js web framework
- JWT authentication
- Environment variable configuration
- NPM package management

## Prerequisites

- Node.js (v20 or later recommended)
- npm (comes with Node.js)
- PostgreSQL database

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/conradsuuna/Greenhub.git
   cd into the repo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Copy contents of `.env.example` into the created `.env`.

## Usage

To start the server:
```
   npm run dev
   ```

## API Documentation

For detailed API documentation and testing, please refer to the [Postman Collection](https://documenter.getpostman.com/view/6379157/2sAXxJhEfH).

## Development

This project uses the following main dependencies:

- Express.js for the web framework
- Prisma as the ORM for database operations
- bcrypt for password hashing
- jsonwebtoken for JWT authentication

To make changes to the database, update the Prisma schema file and run migrations:

```
npx prisma migrate dev
```