//server.js

const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const sharepointRoutes = require('./routes/sharepointRoutes');
const sharepointRoutesTbl_InvItemsLocOri_ID = require('./routes/sharepointRoutesTbl_InvItemsLocOri_ID');
const sharepointRoutesTbl_Loc = require('./routes/sharepointRoutesTbl_Loc'); // Add new route file
const notifyByEmail = require('./utils/sendErrorEmail');
const cors = require('cors');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/sharepoint', sharepointRoutes);
app.use('/api/sharepoint-tbl-invitems-locori', sharepointRoutesTbl_InvItemsLocOri_ID);
app.use('/api/sharepoint-tbl-loc', sharepointRoutesTbl_Loc); // Add new route prefix

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});