const express = require('express');
const router = express.Router();
const { Message, User , Group } = require('../models');
const authMiddleware = require('./authMiddleware'); // Middleware d'authentification

// Importer le serveur WebSocket
const io = require('../app').io; 

// Route to create a new group
router.post('/groups', authMiddleware, async (req, res) => {
    try {
      // Extract group data from the request body
      const { nom, description } = req.body;
  
      // Get the ID of the authenticated user
      const userId = req.user.id;
  
      // Create the group in the database
      const group = await Group.create({ nom, description });
  
      // Add the authenticated user to the group
      await group.addUser(userId);
  
      // Send a success response with the created group data
      return res.status(201).json(group);
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Route to add users to a group
router.post('/groups/:groupId/add-users', authMiddleware, async (req, res) => {
    try {
      // Extract groupId and userIds from the request parameters and body
      const { groupId } = req.params;
      const { userIds } = req.body;
  
      // Find the group by its ID
      const group = await Group.findByPk(groupId);
  
      // If the group doesn't exist, return a 404 error
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      // Find the users to add to the group
      const users = await User.findAll({ where: { id: userIds } });
  
      // If any of the users don't exist, return a 404 error
      if (users.length !== userIds.length) {
        return res.status(404).json({ error: 'One or more users not found' });
      }
  
      // Add the users to the group
      await group.addUsers(users);
  
      // Send a success response
      return res.status(200).json({ message: 'Users added to the group successfully' });
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Middleware pour vérifier l'appartenance de l'utilisateur au groupe
const verifyGroupMembership = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const { userId } = req.user;
  
      // Vérifier si l'utilisateur appartient au groupe
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Group,
            where: { id: groupId }
          }
        ]
      });
  
      // Si l'utilisateur n'appartient pas au groupe, renvoyer une erreur 403 (Forbidden)
      if (!user || !user.Groups.length) {
        return res.status(403).json({ error: "You don't have permission to send messages to this group" });
      }
  
      // Si l'utilisateur appartient au groupe, passer au middleware suivant
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Route pour envoyer un message dans un groupe
  router.post('/groups/:groupId/send-message', authMiddleware, verifyGroupMembership, async (req, res) => {
    try {
      // Extraire les données du message à partir du corps de la requête
      const { contenu } = req.body;
      const { groupId } = req.params;
      const { userId } = req.user;
  
      // Créer le message dans la base de données avec l'ID de l'utilisateur et l'ID du groupe
      const message = await Message.create({ contenu, senderId: userId, groupId });
  
      // Envoyer un événement vers le serveur WebSocket pour envoyer le message au groupe
      if (io) {
        io.emit('sendMessageToGroup', { groupId, message });
      } else {
        console.error('WebSocket server is not available');
      }
  
      // Envoyer une réponse de succès
      return res.status(200).json({ message: 'Message sent to the group successfully' });
    } catch (error) {
      // Gérer les erreurs et envoyer une réponse d'erreur
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  