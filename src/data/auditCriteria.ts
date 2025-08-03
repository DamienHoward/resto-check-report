import { AuditSection } from '@/types/audit';

export const AUDIT_SECTIONS: AuditSection[] = [
  {
    name: "Zone Terrasse",
    criteria: [
      {
        id: "terrasse_1",
        section: "Zone Terrasse",
        criteria: "État de propreté général de l'espace terrasse (sol, tables, chaises, pieds de parasols, vitres)"
      },
      {
        id: "terrasse_2",
        section: "Zone Terrasse", 
        criteria: "Disposition et alignement correct du mobilier"
      },
      {
        id: "terrasse_3",
        section: "Zone Terrasse",
        criteria: "État et tension appropriée des parasols"
      },
      {
        id: "terrasse_4",
        section: "Zone Terrasse",
        criteria: "Fixation et stabilité du mobilier (bancs vissés)"
      },
      {
        id: "terrasse_5",
        section: "Zone Terrasse",
        criteria: "Approvisionnement correct des distributeurs de serviettes"
      },
      {
        id: "terrasse_6",
        section: "Zone Terrasse",
        criteria: "Remise en état systématique des tables (débarrassage)"
      },
      {
        id: "terrasse_7",
        section: "Zone Terrasse",
        criteria: "Présentation soignée des supports marketing (présentoirs menus propres et droits)"
      }
    ]
  },
  {
    name: "Zone Salle",
    criteria: [
      {
        id: "salle_1",
        section: "Zone Salle",
        criteria: "Agencement optimal et logique des tables"
      },
      {
        id: "salle_2",
        section: "Zone Salle",
        criteria: "Propreté irréprochable des surfaces de service"
      },
      {
        id: "salle_3",
        section: "Zone Salle",
        criteria: "Approvisionnement adéquat des distributeurs d'hygiène"
      },
      {
        id: "salle_4",
        section: "Zone Salle",
        criteria: "Respect des règles de sécurité (stockage bouteilles en verre)"
      },
      {
        id: "salle_5",
        section: "Zone Salle",
        criteria: "Propreté et organisation du poste de débarrassage"
      },
      {
        id: "salle_6",
        section: "Zone Salle",
        criteria: "Hygiène exemplaire des postes de service (sauces/couverts)"
      },
      {
        id: "salle_7",
        section: "Zone Salle",
        criteria: "Maintenance et propreté des équipements (bornes de commande)"
      },
      {
        id: "salle_8",
        section: "Zone Salle",
        criteria: "Fonctionnement optimal du matériel (imprimantes, écrans)"
      },
      {
        id: "salle_9",
        section: "Zone Salle",
        criteria: "Sécurité et propreté des sols (surfaces non glissantes)"
      },
      {
        id: "salle_10",
        section: "Zone Salle",
        criteria: "Rangement et organisation générale de l'espace"
      },
      {
        id: "salle_11",
        section: "Zone Salle",
        criteria: "Hygiène des sanitaires avec réserves complètes (savon, papier)"
      },
      {
        id: "salle_12",
        section: "Zone Salle",
        criteria: "Confort climatique approprié (chauffage/climatisation)"
      },
      {
        id: "salle_13",
        section: "Zone Salle",
        criteria: "Présentation soignée des produits (vitrine cookies propre)"
      },
      {
        id: "salle_14",
        section: "Zone Salle",
        criteria: "Merchandising et présentation attractive des produits"
      }
    ]
  },
  {
    name: "Gestion et Service",
    criteria: [
      {
        id: "gestion_1",
        section: "Gestion et Service",
        criteria: "Organisation efficace de l'accueil et gestion fluide de la file d'attente"
      },
      {
        id: "gestion_2",
        section: "Gestion et Service",
        criteria: "Gestion optimale du stress de l'équipe"
      },
      {
        id: "gestion_3",
        section: "Gestion et Service",
        criteria: "Atmosphère chaleureuse et accueillante"
      },
      {
        id: "gestion_4",
        section: "Gestion et Service",
        criteria: "Niveau sonore approprié pour le confort des clients"
      },
      {
        id: "gestion_5",
        section: "Gestion et Service",
        criteria: "Diffusion musicale conforme aux standards de l'établissement"
      },
      {
        id: "gestion_6",
        section: "Gestion et Service",
        criteria: "Gestion optimale des commandes en ligne (disponibilité, mode occupé)"
      }
    ]
  },
  {
    name: "Service Client",
    criteria: [
      {
        id: "service_1",
        section: "Service Client",
        criteria: "Temps d'attente respectés en heure de pointe (inférieur à 8 minutes)"
      },
      {
        id: "service_2",
        section: "Service Client",
        criteria: "Service des boissons dans les délais (moins de 2 minutes)"
      },
      {
        id: "service_3",
        section: "Service Client",
        criteria: "Service des burgers dans les délais (moins de 8 minutes)"
      },
      {
        id: "service_4",
        section: "Service Client",
        criteria: "Service des desserts dans les délais (moins de 3 minutes)"
      },
      {
        id: "service_5",
        section: "Service Client",
        criteria: "Accueil client systématique dans les 30 secondes"
      },
      {
        id: "service_6",
        section: "Service Client",
        criteria: "Politesse et remerciements systématiques aux clients"
      },
      {
        id: "service_7",
        section: "Service Client",
        criteria: "Débarrassage efficace des tables occupées"
      }
    ]
  },
  {
    name: "Hygiène - Collaborateurs",
    criteria: [
      {
        id: "hygiene_collab_1",
        section: "Hygiène - Collaborateurs",
        criteria: "Port systématique de la tenue réglementaire complète (tablier, t-shirt propre, charlotte/casquette)"
      },
      {
        id: "hygiene_collab_2",
        section: "Hygiène - Collaborateurs",
        criteria: "Propreté corporelle irréprochable et absence de bijoux"
      },
      {
        id: "hygiene_collab_3",
        section: "Hygiène - Collaborateurs",
        criteria: "Respect scrupuleux de l'usage des gants"
      },
      {
        id: "hygiene_collab_4",
        section: "Hygiène - Collaborateurs",
        criteria: "Pointage effectué par l'ensemble de l'équipe"
      },
      {
        id: "hygiene_collab_5",
        section: "Hygiène - Collaborateurs",
        criteria: "Lavage des mains systématique (savon et papier à usage unique disponibles)"
      },
      {
        id: "hygiene_collab_6",
        section: "Hygiène - Collaborateurs",
        criteria: "Téléphones personnels rangés dans les vestiaires"
      },
      {
        id: "hygiene_collab_7",
        section: "Hygiène - Collaborateurs",
        criteria: "Propreté et rangement optimal des vestiaires du personnel"
      },
      {
        id: "hygiene_collab_8",
        section: "Hygiène - Collaborateurs",
        criteria: "Stockage réglementaire des déchets dans les locaux alimentaires"
      },
      {
        id: "hygiene_collab_9",
        section: "Hygiène - Collaborateurs",
        criteria: "Contrôles et enregistrements réglementaires à jour"
      }
    ]
  },
  {
    name: "Hygiène - Salle",
    criteria: [
      {
        id: "hygiene_salle_1",
        section: "Hygiène - Salle",
        criteria: "Datage systématique des produits laitiers (chantilly, lait)"
      },
      {
        id: "hygiene_salle_2",
        section: "Hygiène - Salle",
        criteria: "Propreté exemplaire de la zone cuisine visible par les clients"
      },
      {
        id: "hygiene_salle_3",
        section: "Hygiène - Salle",
        criteria: "Datage rigoureux de tous les produits alimentaires"
      },
      {
        id: "hygiene_salle_4",
        section: "Hygiène - Salle",
        criteria: "Propreté impeccable des sols et joints (absence de déchets)"
      },
      {
        id: "hygiene_salle_5",
        section: "Hygiène - Salle",
        criteria: "Organisation et propreté rigoureuses des réfrigérateurs"
      },
      {
        id: "hygiene_salle_6",
        section: "Hygiène - Salle",
        criteria: "Respect strict des DLC et application de la méthode FIFO"
      },
      {
        id: "hygiene_salle_7",
        section: "Hygiène - Salle",
        criteria: "Contrôle des huiles réalisé et enregistrements à jour"
      }
    ]
  },
  {
    name: "Poste Friture",
    criteria: [
      {
        id: "friture_1",
        section: "Poste Friture",
        criteria: "Température friteuse optimale et contrôlée (190°C)"
      },
      {
        id: "friture_2",
        section: "Poste Friture",
        criteria: "Assaisonnement approprié et homogène des frites"
      },
      {
        id: "friture_3",
        section: "Poste Friture",
        criteria: "Quantités préparées optimales (maximum 5 minutes en chauffe-frites)"
      },
      {
        id: "friture_4",
        section: "Poste Friture",
        criteria: "Stock et conditionnement packaging appropriés"
      },
      {
        id: "friture_5",
        section: "Poste Friture",
        criteria: "Propreté exemplaire des bacs de packaging"
      },
      {
        id: "friture_6",
        section: "Poste Friture",
        criteria: "Niveau d'huile correct et contrôlé"
      },
      {
        id: "friture_7",
        section: "Poste Friture",
        criteria: "Cuisson conforme aux standards de qualité"
      },
      {
        id: "friture_8",
        section: "Poste Friture",
        criteria: "Préparation smash potatoes (écrasage, assaisonnement, coloration)"
      }
    ]
  },
  {
    name: "Poste Poulet",
    criteria: [
      {
        id: "poulet_1",
        section: "Poste Poulet",
        criteria: "Qualité et fluidité optimale de la panure (eau froide)"
      },
      {
        id: "poulet_2",
        section: "Poste Poulet",
        criteria: "Respect rigoureux du processus de panage"
      },
      {
        id: "poulet_3",
        section: "Poste Poulet",
        criteria: "Assaisonnement correct et homogène (épices)"
      },
      {
        id: "poulet_4",
        section: "Poste Poulet",
        criteria: "Temps de conservation respecté (maximum 8 minutes dans le bac)"
      },
      {
        id: "poulet_5",
        section: "Poste Poulet",
        criteria: "Dosage sauce poulet coréen respecté selon les standards"
      },
      {
        id: "poulet_6",
        section: "Poste Poulet",
        criteria: "Contrôle systématique du poids avant service (160-180g maximum)"
      },
      {
        id: "poulet_7",
        section: "Poste Poulet",
        criteria: "Utilisation systématique des timers de cuisson"
      }
    ]
  },
  {
    name: "Poste Grill",
    criteria: [
      {
        id: "grill_1",
        section: "Poste Grill",
        criteria: "Technique de smash correcte et maîtrisée"
      },
      {
        id: "grill_2",
        section: "Poste Grill",
        criteria: "Cuisson optimale de la viande (bien colorée, non surcuite)"
      },
      {
        id: "grill_3",
        section: "Poste Grill",
        criteria: "Fonte appropriée du fromage (ni excessive, ni insuffisante)"
      },
      {
        id: "grill_4",
        section: "Poste Grill",
        criteria: "Cuisson steak végétarien conforme aux standards"
      },
      {
        id: "grill_5",
        section: "Poste Grill",
        criteria: "Respect des dosages sel et poivre selon les standards"
      },
      {
        id: "grill_6",
        section: "Poste Grill",
        criteria: "Nettoyage systématique de la plancha entre chaque session"
      },
      {
        id: "grill_7",
        section: "Poste Grill",
        criteria: "Cuisson appropriée du bacon avant service"
      }
    ]
  },
  {
    name: "Poste Garniture",
    criteria: [
      {
        id: "garniture_1",
        section: "Poste Garniture",
        criteria: "Respect rigoureux des dosages de tous les ingrédients"
      },
      {
        id: "garniture_2",
        section: "Poste Garniture",
        criteria: "Gestion précise des suppléments et retraits d'ingrédients"
      },
      {
        id: "garniture_3",
        section: "Poste Garniture",
        criteria: "Respect du codage couleur des sauces (pistolets identifiés)"
      },
      {
        id: "garniture_4",
        section: "Poste Garniture",
        criteria: "Température optimale des oignons confits"
      },
      {
        id: "garniture_5",
        section: "Poste Garniture",
        criteria: "Toast du pain conforme aux standards de qualité"
      }
    ]
  }
];