import { supabase } from '@/integrations/supabase/client';
import { AuditData, AuditImprovementSuggestion } from '@/types/audit';

export const auditService = {
  async saveAudit(auditData: AuditData): Promise<string> {
    try {
      // Save main audit record
      const { data: auditRecord, error: auditError } = await supabase
        .from('audits')
        .insert({
          restaurant_name: auditData.restaurantName,
          auditor_name: auditData.auditorName,
          audit_date: auditData.auditDate,
          total_items: auditData.totalItems,
          yes_count: auditData.yesCount,
          no_count: auditData.noCount,
          success_percentage: auditData.successPercentage,
          status: auditData.status
        })
        .select()
        .single();

      if (auditError) throw auditError;

      const auditId = auditRecord.id;

      // Save audit items
      const auditItems = auditData.sections.flatMap(section =>
        section.criteria
          .filter(criteria => criteria.response !== undefined)
          .map(criteria => ({
            audit_id: auditId,
            section: section.name,
            criteria: criteria.criteria,
            response: criteria.response
          }))
      );

      if (auditItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('audit_items')
          .insert(auditItems);

        if (itemsError) throw itemsError;
      }

      // Generate and save improvement suggestions
      const improvements = generateImprovementSuggestions(auditData);
      if (improvements.length > 0) {
        const improvementRecords = improvements.map(improvement => ({
          audit_id: auditId,
          section: improvement.section,
          criteria: improvement.criteria,
          suggestion: improvement.suggestion,
          priority: improvement.priority
        }));

        const { error: improvementsError } = await supabase
          .from('audit_improvements')
          .insert(improvementRecords);

        if (improvementsError) throw improvementsError;
      }

      return auditId;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'audit:', error);
      throw error;
    }
  }
};

function generateImprovementSuggestions(auditData: AuditData): AuditImprovementSuggestion[] {
  const suggestions: AuditImprovementSuggestion[] = [];

  auditData.sections.forEach(section => {
    section.criteria.forEach(criteria => {
      if (criteria.response === false) {
        const suggestion = getImprovementSuggestion(section.name, criteria.criteria);
        if (suggestion) {
          suggestions.push({
            section: section.name,
            criteria: criteria.criteria,
            suggestion: suggestion.text,
            priority: suggestion.priority
          });
        }
      }
    });
  });

  return suggestions;
}

function getImprovementSuggestion(section: string, criteria: string): { text: string; priority: 'low' | 'medium' | 'high' } | null {
  // Suggestions d'amélioration basées sur les critères
  const suggestions: { [key: string]: { text: string; priority: 'low' | 'medium' | 'high' } } = {
    // Zone Terrasse
    'État de propreté général de l\'espace terrasse': {
      text: 'Effectuer un nettoyage approfondi quotidien de la terrasse. Vérifier l\'état des parasols et du mobilier.',
      priority: 'medium'
    },
    'Disposition et alignement correct du mobilier': {
      text: 'Réaligner le mobilier selon les standards établis. Former l\'équipe sur la disposition optimale.',
      priority: 'low'
    },

    // Hygiène - Collaborateurs
    'Port systématique de la tenue réglementaire complète': {
      text: 'Rappel immédiat des règles d\'hygiène. Vérification systématique avant prise de poste.',
      priority: 'high'
    },
    'Respect scrupuleux de l\'usage des gants': {
      text: 'Formation urgente sur l\'hygiène des mains et l\'usage des gants. Contrôle renforcé.',
      priority: 'high'
    },
    'Lavage des mains systématique': {
      text: 'Installation de rappels visuels. Vérification des stocks de savon et papier.',
      priority: 'high'
    },

    // Service Client
    'Temps d\'attente respectés en heure de pointe': {
      text: 'Optimiser l\'organisation en cuisine. Ajouter du personnel aux heures de pointe si nécessaire.',
      priority: 'high'
    },
    'Accueil client systématique dans les 30 secondes': {
      text: 'Formation service client. Mise en place d\'un système d\'alerte pour l\'accueil.',
      priority: 'medium'
    },

    // Hygiène Salle
    'Datage systématique des produits laitiers': {
      text: 'Formation HACCP renforcée. Mise en place d\'un système de traçabilité strict.',
      priority: 'high'
    },
    'Respect strict des DLC et application de la méthode FIFO': {
      text: 'Audit interne quotidien des DLC. Formation équipe sur la méthode FIFO.',
      priority: 'high'
    },

    // Postes de production
    'Température friteuse optimale et contrôlée': {
      text: 'Calibrage immédiat des équipements. Contrôle horaire des températures.',
      priority: 'high'
    },
    'Respect rigoureux du processus de panage': {
      text: 'Formation technique renforcée. Mise en place de fiches de procédures visuelles.',
      priority: 'medium'
    }
  };

  // Recherche par mots-clés pour les critères non listés
  if (suggestions[criteria]) {
    return suggestions[criteria];
  }

  // Suggestions génériques basées sur les mots-clés
  if (criteria.toLowerCase().includes('propreté') || criteria.toLowerCase().includes('hygiène')) {
    return {
      text: 'Renforcer les procédures de nettoyage et d\'hygiène. Formation de l\'équipe recommandée.',
      priority: 'medium'
    };
  }

  if (criteria.toLowerCase().includes('température') || criteria.toLowerCase().includes('cuisson')) {
    return {
      text: 'Vérifier et calibrer les équipements. Contrôler régulièrement les températures.',
      priority: 'high'
    };
  }

  if (criteria.toLowerCase().includes('temps') || criteria.toLowerCase().includes('délai')) {
    return {
      text: 'Optimiser l\'organisation et les processus. Former l\'équipe à la gestion du temps.',
      priority: 'medium'
    };
  }

  if (criteria.toLowerCase().includes('stock') || criteria.toLowerCase().includes('approvisionnement')) {
    return {
      text: 'Améliorer la gestion des stocks. Mettre en place des procédures de réapprovisionnement.',
      priority: 'low'
    };
  }

  return {
    text: 'Revoir les procédures pour ce critère. Formation de l\'équipe recommandée.',
    priority: 'medium'
  };
}