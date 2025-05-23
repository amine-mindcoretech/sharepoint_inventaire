const express = require('express');
const { syncSharePointData, syncSharePointItemsData, syncGeniusData, syncGeniusItemsData, replaceSharePointWithGeniusInvItems, replaceSharePointWithGeniusItems } = require('../controllers/sharepointControllerTbl_InvItemsLocOri_ID');
const notifyByEmail = require('../utils/sendErrorEmail');

const router = express.Router();

router.get('/sync-genius-Tbl-InvItemsLocOri', async (req, res) => {
    try {
        await syncGeniusData();
        res.status(200).json({ message: '✅ Synchronisation Genius Tbl_InvItemsLocOri réussie !' });
    } catch (error) {
        await notifyByEmail('❌ Erreur lors de la synchronisation Genius Tbl_InvItemsLocOri', error.message);
        res.status(500).json({ error: '❌ Échec de la synchronisation Genius Tbl_InvItemsLocOri.' });
    }
});

router.get('/sync-sharepoint-Tbl-InvItemsLocOri', async (req, res) => {
    try {
        await syncSharePointData();
        res.status(200).json({ message: '✅ Synchronisation SharePoint Tbl_InvItemsLocOri réussie !' });
    } catch (error) {
        await notifyByEmail('❌ Erreur lors de la synchronisation SharePoint Tbl_InvItemsLocOri', error.message);
        res.status(500).json({ error: '❌ Échec de la synchronisation SharePoint Tbl_InvItemsLocOri.' });
    }
});

router.get('/sync-genius-Tbl-Items', async (req, res) => {
    try {
        await syncGeniusItemsData();
        res.status(200).json({ message: '✅ Synchronisation Genius Tbl_Items réussie !' });
    } catch (error) {
        await notifyByEmail('❌ Erreur lors de la synchronisation Genius Tbl_Items', error.message);
        res.status(500).json({ error: '❌ Échec de la synchronisation Genius Tbl_Items.' });
    }
});

router.get('/sync-sharepoint-Tbl-Items', async (req, res) => {
    try {
        await syncSharePointItemsData();
        res.status(200).json({ message: '✅ Synchronisation SharePoint Tbl_Items réussie !' });
    } catch (error) {
        await notifyByEmail('❌ Erreur lors de la synchronisation SharePoint Tbl_Items', error.message);
        res.status(500).json({ error: '❌ Échec de la synchronisation SharePoint Tbl_Items.' });
    }
});

router.get('/replace-with-genius-Tbl-InvItemsLocOri', async (req, res) => {
    try {
        const { deletionDuration, insertionDuration } = await replaceSharePointWithGeniusInvItems();
        res.status(200).json({ message: '✅ Remplacement SharePoint par Genius Tbl_InvItemsLocOri terminé !', deletionDuration, insertionDuration });
    } catch (error) {
        await notifyByEmail('❌ Erreur lors du remplacement SharePoint par Genius (Tbl_InvItemsLocOri)', error.message);
        res.status(500).json({ error: '❌ Échec du remplacement SharePoint par Genius Tbl_InvItemsLocOri.' });
    }
});

router.get('/replace-with-genius-Tbl-Items', async (req, res) => {
    try {
        const { deletionDuration, insertionDuration } = await replaceSharePointWithGeniusItems();
        res.status(200).json({ message: '✅ Remplacement SharePoint par Genius Tbl_Items terminé !', deletionDuration, insertionDuration });
    } catch (error) {
        await notifyByEmail('❌ Erreur lors du remplacement SharePoint par Genius (Tbl_Items)', error.message);
        res.status(500).json({ error: '❌ Échec du remplacement SharePoint par Genius Tbl_Items.' });
    }
});

module.exports = router;