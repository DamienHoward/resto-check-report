import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Building, TrendingUp, FileText, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuditRecord {
  id: string;
  restaurant_name: string;
  auditor_name: string;
  audit_date: string;
  total_items: number;
  yes_count: number;
  no_count: number;
  success_percentage: number;
  status: string;
  created_at: string;
}

interface AuditHistoryProps {
  onBack: () => void;
  onViewReport: (auditId: string) => void;
  onSendEmail: (auditId: string) => void;
}

export const AuditHistory = ({ onBack, onViewReport, onSendEmail }: AuditHistoryProps) => {
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudits(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des audits",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSuccessBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Chargement de l'historique...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <CardTitle className="text-2xl font-bold text-primary">
              Historique des Audits
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      {audits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{audits.length}</div>
              <div className="text-sm text-muted-foreground">Total audits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(audits.reduce((acc, audit) => acc + audit.success_percentage, 0) / audits.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Moyenne réussite</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {audits.filter(audit => audit.success_percentage >= 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Audits excellents (≥80%)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {audits.filter(audit => audit.success_percentage < 60).length}
              </div>
              <div className="text-sm text-muted-foreground">Audits critiques (&lt;60%)</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audit List */}
      <div className="space-y-4">
        {audits.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground">Aucun audit disponible</div>
            </CardContent>
          </Card>
        ) : (
          audits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{audit.restaurant_name}</span>
                      <Badge variant={getSuccessBadgeVariant(audit.success_percentage)}>
                        {audit.success_percentage}%
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(audit.audit_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {audit.auditor_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {audit.yes_count}/{audit.total_items} critères validés
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewReport(audit.id)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Voir le rapport
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSendEmail(audit.id)}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Envoyer par email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};