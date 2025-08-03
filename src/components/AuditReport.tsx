import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Building, User, Calendar, TrendingUp, AlertTriangle, CheckCircle, XCircle, Mail, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuditReportData {
  id: string;
  restaurant_name: string;
  auditor_name: string;
  audit_date: string;
  total_items: number;
  yes_count: number;
  no_count: number;
  success_percentage: number;
  items: Array<{
    section: string;
    criteria: string;
    response: boolean;
  }>;
  improvements: Array<{
    section: string;
    criteria: string;
    suggestion: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

interface AuditReportProps {
  auditId: string;
  onBack: () => void;
  onSendEmail: (auditId: string) => void;
}

export const AuditReport = ({ auditId, onBack, onSendEmail }: AuditReportProps) => {
  const [report, setReport] = useState<AuditReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [auditId]);

  const fetchReport = async () => {
    try {
      // Fetch audit data
      const { data: auditData, error: auditError } = await supabase
        .from('audits')
        .select('*')
        .eq('id', auditId)
        .single();

      if (auditError) throw auditError;

      // Fetch audit items
      const { data: itemsData, error: itemsError } = await supabase
        .from('audit_items')
        .select('section, criteria, response')
        .eq('audit_id', auditId);

      if (itemsError) throw itemsError;

      // Fetch improvements
      const { data: improvementsData, error: improvementsError } = await supabase
        .from('audit_improvements')
        .select('section, criteria, suggestion, priority')
        .eq('audit_id', auditId);

      if (improvementsError) throw improvementsError;

      setReport({
        ...auditData,
        items: itemsData || [],
        improvements: (improvementsData || []) as Array<{
          section: string;
          criteria: string;
          suggestion: string;
          priority: 'low' | 'medium' | 'high';
        }>
      });
    } catch (error) {
      console.error('Erreur lors du chargement du rapport:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le rapport d'audit",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSuccessBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité haute';
      case 'medium': return 'Priorité moyenne';
      default: return 'Priorité basse';
    }
  };

  const groupItemsBySection = () => {
    if (!report) return {};
    
    const grouped: { [key: string]: Array<{ criteria: string; response: boolean }> } = {};
    
    report.items.forEach(item => {
      if (!grouped[item.section]) {
        grouped[item.section] = [];
      }
      grouped[item.section].push({
        criteria: item.criteria,
        response: item.response
      });
    });
    
    return grouped;
  };

  const exportToPDF = () => {
    // This would be implemented with a PDF library
    toast({
      title: "Export PDF",
      description: "Fonctionnalité d'export PDF en cours de développement",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Chargement du rapport...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-muted-foreground">Rapport introuvable</div>
            <Button onClick={onBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sectionData = groupItemsBySection();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <CardTitle className="text-2xl font-bold text-primary">
                Rapport d'Audit
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={() => onSendEmail(report.id)}>
                <Mail className="h-4 w-4 mr-2" />
                Envoyer par email
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Audit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informations Générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Restaurant:</span>
              <span>{report.restaurant_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Auditeur:</span>
              <span>{report.auditor_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date:</span>
              <span>{formatDate(report.audit_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Score:</span>
              <Badge variant={getSuccessBadgeVariant(report.success_percentage)}>
                {report.success_percentage}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600">{report.yes_count}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <CheckCircle className="h-4 w-4" />
              Critères validés
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-red-600">{report.no_count}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <XCircle className="h-4 w-4" />
              Critères non validés
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">{report.total_items}</div>
            <div className="text-sm text-muted-foreground mt-1">Total critères</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results by Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Résultats Détaillés par Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(sectionData).map(([sectionName, items]) => {
            const yesCount = items.filter(item => item.response).length;
            const totalCount = items.length;
            const sectionPercentage = Math.round((yesCount / totalCount) * 100);
            
            return (
              <div key={sectionName} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{sectionName}</h3>
                  <Badge variant={getSuccessBadgeVariant(sectionPercentage)}>
                    {yesCount}/{totalCount} ({sectionPercentage}%)
                  </Badge>
                </div>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      {item.response ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={item.response ? 'text-green-800' : 'text-red-800'}>
                        {item.criteria}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      {report.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Points d'Amélioration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.improvements.map((improvement, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="font-medium">{improvement.section}</div>
                    <div className="text-sm text-muted-foreground">{improvement.criteria}</div>
                    <div className="text-sm">{improvement.suggestion}</div>
                  </div>
                  <Badge variant={getPriorityBadgeVariant(improvement.priority)}>
                    {getPriorityLabel(improvement.priority)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};