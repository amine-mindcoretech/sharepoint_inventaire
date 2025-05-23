const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const sharepointRoutes = require('./routes/sharepointRoutes');
const sharepointRoutesTbl_InvItemsLocOri_ID = require('./routes/sharepointRoutesTbl_InvItemsLocOri_ID');
const notifyByEmail = require('./utils/sendErrorEmail');
const cors = require('cors');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// State to prevent concurrent executions
let isFetchingSharepointSync = false;
let isFetchingGeniusSync = false;
let isFetchingSharepointItemsSync = false;
let isFetchingGeniusItemsSync = false;
let isFetchingReplaceInvItems = false;
let isFetchingReplaceItems = false;

let fetchIntervalSharepointSync;
let fetchIntervalGeniusSync;
let fetchIntervalSharepointItemsSync;
let fetchIntervalGeniusItemsSync;
let fetchIntervalReplaceInvItems;
let fetchIntervalReplaceItems;

// Function to execute SharePoint sync for Tbl_InvItemsLocOri
const executeSharepointSync = async () => {
    if (isFetchingSharepointSync) {
        console.log("⚠️ Une exécution SharePoint sync est déjà en cours...");
        return;
    }
    isFetchingSharepointSync = true;
    console.log("🔄 Exécution de syncSharePointData pour Tbl_InvItemsLocOri...");
    try {
        await require('./controllers/sharepointControllerTbl_InvItemsLocOri_ID').syncSharePointData();
        console.log("✅ Synchronisation SharePoint terminée pour Tbl_InvItemsLocOri !");
    } catch (error) {
        console.error("❌ Erreur lors de la synchronisation SharePoint Tbl_InvItemsLocOri :", error.message);
        await notifyByEmail("❌ Erreur lors de la synchronisation SharePoint Tbl_InvItemsLocOri", error.message);
    } finally {
        isFetchingSharepointSync = false;
    }
};

// Function to execute Genius sync for Tbl_InvItemsLocOri
const executeGeniusSync = async () => {
    if (isFetchingGeniusSync) {
        console.log("⚠️ Une exécution Genius sync est déjà en cours...");
        return;
    }
    isFetchingGeniusSync = true;
    console.log("🔄 Exécution de syncGeniusData pour Tbl_InvItemsLocOri...");
    try {
        await require('./controllers/sharepointControllerTbl_InvItemsLocOri_ID').syncGeniusData();
        console.log("✅ Synchronisation Genius terminée pour Tbl_InvItemsLocOri !");
    } catch (error) {
        console.error("❌ Erreur lors de la synchronisation Genius Tbl_InvItemsLocOri :", error.message);
        await notifyByEmail("❌ Erreur lors de la synchronisation Genius Tbl_InvItemsLocOri", error.message);
    } finally {
        isFetchingGeniusSync = false;
    }
};

// Function to execute SharePoint sync for Tbl_Items
const executeSharepointItemsSync = async () => {
    if (isFetchingSharepointItemsSync) {
        console.log("⚠️ Une exécution SharePoint sync est déjà en cours (Tbl_Items)...");
        return;
    }
    isFetchingSharepointItemsSync = true;
    console.log("🔄 Exécution de syncSharePointItemsData pour Tbl_Items...");
    try {
        await require('./controllers/sharepointControllerTbl_InvItemsLocOri_ID').syncSharePointItemsData();
        console.log("✅ Synchronisation SharePoint terminée pour Tbl_Items !");
    } catch (error) {
        console.error("❌ Erreur lors de la synchronisation SharePoint Tbl_Items :", error.message);
        await notifyByEmail("❌ Erreur lors de la synchronisation SharePoint Tbl_Items", error.message);
    } finally {
        isFetchingSharepointItemsSync = false;
    }
};

// Function to execute Genius sync for Tbl_Items
const executeGeniusItemsSync = async () => {
    if (isFetchingGeniusItemsSync) {
        console.log("⚠️ Une exécution Genius sync est déjà en cours (Tbl_Items)...");
        return;
    }
    isFetchingGeniusItemsSync = true;
    console.log("🔄 Exécution de syncGeniusItemsData pour Tbl_Items...");
    try {
        await require('./controllers/sharepointControllerTbl_InvItemsLocOri_ID').syncGeniusItemsData();
        console.log("✅ Synchronisation Genius terminée pour Tbl_Items !");
    } catch (error) {
        console.error("❌ Erreur lors de la synchronisation Genius Tbl_Items :", error.message);
        await notifyByEmail("❌ Erreur lors de la synchronisation Genius Tbl_Items", error.message);
    } finally {
        isFetchingGeniusItemsSync = false;
    }
};

// Function to execute replaceSharePointWithGeniusInvItems
const executeReplaceInvItems = async () => {
    if (isFetchingReplaceInvItems) {
        console.log("⚠️ Une exécution de replaceSharePointWithGeniusInvItems est déjà en cours...");
        return;
    }
    isFetchingReplaceInvItems = true;
    console.log("🔄 Exécution de replaceSharePointWithGeniusInvItems pour Tbl_InvItemsLocOri...");
    try {
        const { deletionDuration, insertionDuration } = await require('./controllers/sharepointControllerTbl_InvItemsLocOri_ID').replaceSharePointWithGeniusInvItems();
        console.log(`✅ Remplacement SharePoint par Genius terminé pour Tbl_InvItemsLocOri !`);
        console.log(`⏱️ Temps total - Suppression: ${formatDuration(deletionDuration)}, Insertion: ${formatDuration(insertionDuration)}`);
    } catch (error) {
        console.error("❌ Erreur lors du remplacement SharePoint par Genius (Tbl_InvItemsLocOri) :", error.message);
        await notifyByEmail("❌ Erreur lors du remplacement SharePoint par Genius (Tbl_InvItemsLocOri)", error.message);
    } finally {
        isFetchingReplaceInvItems = false;
    }
};

// Function to execute replaceSharePointWithGeniusItems
const executeReplaceItems = async () => {
    if (isFetchingReplaceItems) {
        console.log("⚠️ Une exécution de replaceSharePointWithGeniusItems est déjà en cours...");
        return;
    }
    isFetchingReplaceItems = true;
    console.log("🔄 Exécution de replaceSharePointWithGeniusItems pour Tbl_Items...");
    try {
        const { deletionDuration, insertionDuration } = await require('./controllers/sharepointControllerTbl_InvItemsLocOri_ID').replaceSharePointWithGeniusItems();
        console.log(`✅ Remplacement SharePoint par Genius terminé pour Tbl_Items !`);
        console.log(`⏱️ Temps total - Suppression: ${formatDuration(deletionDuration)}, Insertion: ${formatDuration(insertionDuration)}`);
    } catch (error) {
        console.error("❌ Erreur lors du remplacement SharePoint par Genius (Tbl_Items) :", error.message);
        await notifyByEmail("❌ Erreur lors du remplacement SharePoint par Genius (Tbl_Items)", error.message);
    } finally {
        isFetchingReplaceItems = false;
    }
};

// Reset fetch intervals
const resetFetchIntervals = () => {
    if (fetchIntervalSharepointSync) clearInterval(fetchIntervalSharepointSync);
    if (fetchIntervalGeniusSync) clearInterval(fetchIntervalGeniusSync);
    if (fetchIntervalSharepointItemsSync) clearInterval(fetchIntervalSharepointItemsSync);
    if (fetchIntervalGeniusItemsSync) clearInterval(fetchIntervalGeniusItemsSync);
    if (fetchIntervalReplaceInvItems) clearInterval(fetchIntervalReplaceInvItems);
    if (fetchIntervalReplaceItems) clearInterval(fetchIntervalReplaceItems);

    console.log("🔄 Réinitialisation des intervalles de synchronisation...");

    fetchIntervalSharepointSync = setInterval(() => {
        console.log("🕒 Planification de syncSharePointData pour Tbl_InvItemsLocOri...");
        executeSharepointSync();
    }, 2400000); // 40 minutes

    fetchIntervalGeniusSync = setInterval(() => {
        console.log("🕒 Planification de syncGeniusData pour Tbl_InvItemsLocOri...");
        executeGeniusSync();
    }, 2400000); // 40 minutes

    fetchIntervalSharepointItemsSync = setInterval(() => {
        console.log("🕒 Planification de syncSharePointItemsData pour Tbl_Items...");
        executeSharepointItemsSync();
    }, 2400000); // 40 minutes

    fetchIntervalGeniusItemsSync = setInterval(() => {
        console.log("🕒 Planification de syncGeniusItemsData pour Tbl_Items...");
        executeGeniusItemsSync();
    }, 2400000); // 40 minutes

    fetchIntervalReplaceInvItems = setInterval(() => {
        console.log("🕒 Planification de replaceSharePointWithGeniusInvItems pour Tbl_InvItemsLocOri...");
        executeReplaceInvItems();
    }, 2400000); // 40 minutes

    fetchIntervalReplaceItems = setInterval(() => {
        console.log("🕒 Planification de replaceSharePointWithGeniusItems pour Tbl_Items...");
        executeReplaceItems();
    }, 2400000); // 40 minutes
};

// Initial execution
console.log("🚀 Exécution initiale de toutes les tâches SharePoint...");
// executeSharepointSync();
// executeGeniusSync();
// executeSharepointItemsSync();
// executeGeniusItemsSync();
// executeReplaceInvItems();
// executeReplaceItems();

resetFetchIntervals();

app.use('/api/sharepoint', sharepointRoutes);
app.use('/api/sharepoint-tbl-invitems-locori', sharepointRoutesTbl_InvItemsLocOri_ID);

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});