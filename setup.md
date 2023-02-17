1. Créer la db

```sql
CREATE ROLE oshop WITH LOGIN PASSWORD 'oshop';
CREATE DATABASE oshop WITH OWNER oshop;
```

si on a oublié d'attribuer le OWNER lors de la création :

```sql
ALTER TABLE oshop TO OWNER oshop;
```

Mettre l'url de connexion dans le `.env` :

`PG_URL = postgresql://oshop:oshop@localhost:5432/oshop`

1. Installer les dépendances du projet

`npm install`

3. Faire le seeding de la db

`node create-table.js`