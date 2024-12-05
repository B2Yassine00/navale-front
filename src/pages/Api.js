import axios from 'axios';

// Base URL de l'API (à adapter si nécessaire)
const API_URL = "http://my-app-deployment.francecentral.cloudapp.azure.com:8080";


// 1. Fonction pour gérer le login

export const login = async (username, password) => {
  try {
    const data = {
      username: username,
      password: password
    }

    const response = await axios.post(`${API_URL}/bataille_navale/login`, data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem("userId", response.data.userId);
    return response.data.token;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        console.error('Identifiants incorrects', error.response.data.message);
      } else if (error.response.status === 500) {
        console.error('Erreur serveur', error.response.data.message);
      }
    } else {
      console.error('Login failed', error);
    }
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return Boolean(token); // Returns true if token exists, false otherwise
};


// 2. Fonction pour l'inscription d'un nouvel utilisateur
export const register = async (username, email, password) => {
  try {
    console.log('Envoi de la requête d\'inscription:', username, email, password);
    const response = await axios.post(`${API_URL}/bataille_navale/register`, {
      username,
      email,
      password
    });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem("userId", response.data.userId);
    console.log('Réponse reçue après inscription:', response);
    return response.data.token; // Retourne un token JWT si l'inscription réussit
  } catch (error) {
    console.error('Erreur lors de la requête d\'inscription:', error);

    // Gérer les différents types d'erreurs
    if (error.response) {
      // Cas où l'erreur vient du serveur
      if (error.response.status === 400) {
        // Gestion des erreurs spécifiques
        const errorMessage = error.response.data.message;
        if (errorMessage === "Username already exists!") {
          console.error('Nom d\'utilisateur déjà utilisé.');
        } else if (errorMessage === "Email already exists!") {
          console.error('Email déjà utilisé.');
        } else if (errorMessage === "Invalid email format!") {
          console.error('Format d\'email invalide.');
        } else if (errorMessage === "Invalid Password: password is at least 8 characters.") {
          console.error('Mot de passe trop court (au moins 8 caractères).');
        }
      } else if (error.response.status === 500) {
        console.error('Erreur serveur pendant l\'inscription.');
      }
    } else {
      // Autre type d'erreur (réseau, etc.)
      console.error('Registration failed', error);
    }
    throw error;
  }
};


// 6. Fonction pour démarrer une nouvelle partie
export const startGame1 = async (idPlayer1, idPlayer2, difficulty, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/games/start`,
      {
        idPlayer1,
        idPlayer2,
        difficulty
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Utilisation du token JWT pour l'authentification
        }
      }
    );
    return response.data; // Retourne les informations sur la partie démarrée
  } catch (error) {
    // Gestion des erreurs selon les codes de réponse
    if (error.response) {
      switch (error.response.status) {
        case 400:
          if (error.response.data.message === "Player 1 is not found by id") {
            console.error("L'ID du joueur 1 est introuvable dans la base de données.");
          } else if (error.response.data.message === "The two players cannot have the same id !!") {
            console.error("Les deux joueurs ne peuvent pas avoir le même ID.");
          }
          break;
        case 500:
          console.error("Erreur interne du serveur pendant le démarrage de la partie.");
          break;
        default:
          console.error("Une erreur inattendue est survenue pendant le démarrage de la partie.");
      }
    }
    throw error; // Lève l'erreur pour que le front-end puisse la gérer
  }
};


// 7. Fonction pour changer le mot de passe de l'utilisateur
export const changePassword = async (aPassWord, nPassWord) => {
  try {
    const response = await axios.put(
      `${API_URL}/bataille_navale/passwd`,
      {
        aPassWord, // Ancien mot de passe
        nPassWord  // Nouveau mot de passe
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
      }
    );
    return response.data; // Retourne la réponse (token mis à jour ou message de succès)
  } catch (error) {
    // Gestion des différentes erreurs basées sur la documentation
    if (error.response) {
      switch (error.response.status) {
        case 400:
          if (error.response.data.message === "New password must be different from the current password.") {
            console.error("Le nouveau mot de passe doit être différent de l'ancien.");
          } else if (error.response.data.message === "Invalid current password.") {
            console.error("L'ancien mot de passe est incorrect.");
          } else if (error.response.data.message === "New password must be at least 8 characters long.") {
            console.error("Le nouveau mot de passe doit faire au moins 8 caractères.");
          } else if (error.response.data.message === "New password must be different from the current password.") {
            console.error("Le nouveau mot de passe doit être différent de celui déjà enregistré.");
          }
          break;
        case 401:
          console.error("Le token JWT est invalide.");
          break;
        case 500:
          console.error("Erreur interne du serveur.");
          break;
        default:
          console.error("Une erreur inattendue est survenue.");
      }
    }
    throw error;
  }
};


// 8. Fonction pour changer l'adresse email
export const changeEmail = async (newEmail) => {
  console.log('Nouvel email:', newEmail);
  const token = localStorage.getItem("token");
  const username = getUsernameFromToken(token);
  try {
    const response = await axios.put(
      `${API_URL}/bataille_navale/email`,
      { username, newEmail },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Use token passed as argument
          'Accept': 'application/json',
        },
      }
    );

    // Log success if the request succeeded
    console.log("Succès : L'email a été mis à jour avec succès.");
    return response.data; // Return the response data (e.g., updated token or confirmation)

  } catch (error) {
    // Handle specific API response errors
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          if (data.message === "Invalid email format.") {
            console.error("Erreur : Le format de l'email n'est pas correct.");
          } else if (data.message === "Email is already taken.") {
            console.error("Erreur : Cette adresse email est déjà utilisée.");
          } else {
            console.error("Erreur : Requête invalide.");
          }
          break;
        case 401:
          console.error("Erreur : Token JWT invalide ou manquant.");
          break;
        default:
          console.error("Erreur inattendue lors du changement d'email.");
      }
    } else {
      // Handle network or unexpected errors
      console.error('Erreur réseau ou autre', error.message);
    }
    throw error; // Re-throw the error to allow further handling in the front-end
  }
};


export const getUsernameFromToken = (token) => {
  try {
    const payload = token.split('.')[1]; // Extract payload part of JWT
    const decodedPayload = JSON.parse(atob(payload)); // Decode base64 payload
    return decodedPayload.sub; // Assuming the payload contains `username`
  } catch (error) {
    console.error("Failed to decode token:", error);
    throw new Error("Invalid token format.");
  }
};


// 9. Fonction pour changer le nom d'utilisateur
export const changeUsername = async (newUsername) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is missing. Please log in again.");
  }

  const oldUsername = getUsernameFromToken(token);
  try {
    const response = await axios.put(
      `${API_URL}/bataille_navale/changeUsername`,
      { oldUsername, newUsername }, // Send oldUsername and newUsername in the body
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );
    return response.data; // Retourne le token mis à jour
  } catch (error) {
    // Gestion des erreurs basées sur les réponses possibles de l'API
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          if (data.message === "Username is already taken.") {
            console.error("Erreur : Ce nom d'utilisateur est déjà utilisé.");
          }
          break;
        case 401:
          console.error("Erreur : Token JWT invalide ou manquant.");
          break;
        case 200:
          console.log("Succès : Le nom d'utilisateur a été mis à jour avec succès.");
          break;
        default:
          console.error("Erreur inattendue lors du changement de nom d'utilisateur.");
      }
    } else {
      console.error('Erreur réseau ou autre', error.message);
    }
    throw error; // Lève l'erreur pour que le front-end puisse la gérer
  }
};

// 10. Fonction pour supprimer le compte de l'utilisateur
export const deleteAccount = async (token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/bataille_navale/user/delete`, // URL correcte selon la documentation
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
      }
    );
    return response.data; // Retourne la confirmation de la suppression du compte
  } catch (error) {
    // Gestion des erreurs basées sur les réponses possibles de l'API
    if (error.response && error.response.status === 401) {
      console.error("Erreur : Token JWT invalide ou manquant."); // Gestion de l'erreur 401
    } else {
      console.error("Erreur inattendue lors de la suppression du compte."); // Autres erreurs
    }
    throw error; // Lève l'erreur pour que le front-end puisse la gérer
  }
};


// 11. Fonction pour déclarer un vainqueur
/*
export const declareWinner = async (gameId, winner, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/bataille_navale/vainqueur`, // URL correcte selon la documentation
      {
        gameId, // ID de la partie
        winner  // Joueur vainqueur (exemple: "player_1" ou "player_2")
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Utilisation du token JWT pour l'authentification
        }
      }
    );
    return response.data; // Retourne la confirmation du gagnant
  } catch (error) {
    // Gestion des erreurs basées sur les réponses possibles de l'API
    if (error.response && error.response.status === 500) {
      console.error("Erreur interne lors de la déclaration du vainqueur.");
    } else {
      console.error("Erreur inattendue lors de la déclaration du vainqueur.", error);
    }
    throw error; // Lève l'erreur pour que le front-end puisse la gérer
  }
};
*/
// 11. Fonction pour déclarer un vainqueur
export const declareWinner = async (gameId, winner, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/bataille_navale/vainqueur`, // URL correcte selon la documentation
      {
        gameId, // ID de la partie
        winner  // Joueur vainqueur (exemple: "player_1" ou "player_2")
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Utilisation du token JWT pour l'authentification
        }
      }
    );

    // Vérifie si le statut est 200 et renvoie le message
    if (response.status === 200) {
      return response.data.message; // Le message de victoire "Le winner is player_1"
    }

  } catch (error) {
    // Gestion des erreurs basées sur les réponses possibles de l'API
    if (error.response) {
      switch (error.response.status) {
        case 500:
          console.error("Erreur interne lors de la déclaration du vainqueur."); // Erreur 500
          break;
        default:
          console.error("Erreur inattendue lors de la déclaration du vainqueur."); // Autres erreurs
      }
    }
    throw error; // Lève l'erreur pour que le front-end puisse la gérer
  }
};

// 12. Fonction pour gérer un mouvement (attaque)
export const makeMove = async (gameId, userId, targetPosition, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/bataille_navale/move`, // URL correcte selon la documentation
      {
        gameId,          // ID du jeu
        userId,          // ID de l'utilisateur
        targetPosition   // Position cible (exemple: "A5")
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Utilisation du token JWT pour l'authentification
        }
      }
    );

    // Vérifie si le mouvement a bien été traité (code 200)
    if (response.status === 200) {
      return response.data.message; // Le message : "Move processed and game state updated."
    }

  } catch (error) {
    // Gestion des erreurs basées sur les réponses possibles de l'API
    if (error.response && error.response.status === 500) {
      console.error("Erreur interne lors de la gestion du mouvement."); // Erreur 500
    } else {
      console.error("Erreur inattendue lors de l'attaque.", error); // Autres erreurs
    }
    throw error; // Lève l'erreur pour que le front-end puisse la gérer
  }
};


// Mot de passe oublie :
export const forgottenPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/bataille_navale/forgotPassword`, {
      email
    });
  } catch (error) {
    console.error('Erreur lors de la requête forgot password!', error);
  }
};

export const startGameFunction = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/bataille_navale/start`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
      }
    );
    return response
  } catch (error) {
    console.error(error)
  }
};

export const getAllShips = async () => {
  try {
    const response = await axios.get(`${API_URL}/bataille_navale/ships`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Accept': 'application/json',
      },
    })
    return response
  } catch (error) {
    console.error(error)
  }
}

export const launchGameFunction = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/bataille_navale/launch`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Accept': 'application/json',
      },
    });
    return response
  } catch (error) {
    console.error(error)
  }
}

export const shootFunction = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/bataille_navale/shoot`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Accept': 'application/json',
      },
    });
    return response
  } catch (error) {
    console.error(error)
  }
}

export const endGameFunction = async (gameId, resigningPlayerId) => {
  try {
    const response = await axios.post(
      `${API_URL}/bataille_navale/game/${gameId}/end`,
      { resigningPlayerId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
      }
    );
    return response;
  }
  catch (error) {
    console.error(error)
  }
};
