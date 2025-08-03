import { useState } from 'react';
import { AuditForm } from '@/components/AuditForm';
import { AuditHistory } from '@/components/AuditHistory';
import { AuditReport } from '@/components/AuditReport';
import { auditService } from '@/services/auditService';
import { supabase } from '@/integrations/supabase/client';
import { AuditData } from '@/types/audit';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'form' | 'history' | 'report';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('form');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  const handleSubmitAudit = async (auditData: AuditData) => {
    const auditId = await auditService.saveAudit(auditData);
    setSelectedAuditId(auditId);
    setCurrentView('report');
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleViewReport = (auditId: string) => {
    setSelectedAuditId(auditId);
    setCurrentView('report');
  };

  const handleSendEmail = async (auditId: string) => {
    const email = prompt('Entrez l\'adresse email:');
    if (!email) return;

    try {
      const { data: auditData } = await supabase
        .from('audits')
        .select('*')
        .eq('id', auditId)
        .single();

      await supabase.functions.invoke('send-audit-email', {
        body: {
          auditId,
          recipientEmail: email,
          auditData: {
            restaurantName: auditData.restaurant_name,
            auditorName: auditData.auditor_name,
            auditDate: auditData.audit_date,
            successPercentage: auditData.success_percentage,
            yesCount: auditData.yes_count,
            noCount: auditData.no_count,
            totalItems: auditData.total_items
          }
        }
      });

      toast({
        title: "Email envoyé",
        description: "Le rapport d'audit a été envoyé par email",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    if (currentView === 'report') {
      setCurrentView('history');
    } else {
      setCurrentView('form');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'form' && (
        <AuditForm onSubmit={handleSubmitAudit} onViewHistory={handleViewHistory} />
      )}
      
      {currentView === 'history' && (
        <AuditHistory 
          onBack={handleBack}
          onViewReport={handleViewReport}
          onSendEmail={handleSendEmail}
        />
      )}
      
      {currentView === 'report' && selectedAuditId && (
        <AuditReport 
          auditId={selectedAuditId}
          onBack={handleBack}
          onSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
};

export default Index;
