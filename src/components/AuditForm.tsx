import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { AUDIT_SECTIONS } from '@/data/auditCriteria';
import { AuditData, AuditSection } from '@/types/audit';
import { toast } from '@/hooks/use-toast';

interface AuditFormProps {
  onSubmit: (auditData: AuditData) => Promise<void>;
  onViewHistory: () => void;
}

export const AuditForm = ({ onSubmit, onViewHistory }: AuditFormProps) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [auditorName, setAuditorName] = useState('');
  const [auditDate, setAuditDate] = useState(new Date().toISOString().split('T')[0]);
  const [sections, setSections] = useState<AuditSection[]>(AUDIT_SECTIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCriteriaResponse = (sectionIndex: number, criteriaIndex: number, response: boolean) => {
    const newSections = [...sections];
    newSections[sectionIndex].criteria[criteriaIndex].response = response;
    setSections(newSections);
  };

  const handleSectionComment = (sectionIndex: number, comment: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].comments = comment;
    setSections(newSections);
  };

  const calculateStats = () => {
    const allCriteria = sections.flatMap(section => section.criteria);
    const answeredCriteria = allCriteria.filter(criteria => criteria.response !== undefined);
    const yesCount = answeredCriteria.filter(criteria => criteria.response === true).length;
    const noCount = answeredCriteria.filter(criteria => criteria.response === false).length;
    const totalItems = allCriteria.length;
    const successPercentage = totalItems > 0 ? Math.round((yesCount / totalItems) * 100) : 0;
    
    return { totalItems, yesCount, noCount, successPercentage, answeredCriteria: answeredCriteria.length };
  };

  const handleSubmit = async () => {
    if (!restaurantName || !auditorName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le nom du restaurant et de l'auditeur",
        variant: "destructive"
      });
      return;
    }

    const stats = calculateStats();
    
    if (stats.answeredCriteria < stats.totalItems) {
      toast({
        title: "Audit incomplet",
        description: `${stats.answeredCriteria}/${stats.totalItems} critères complétés. Voulez-vous continuer ?`,
        variant: "destructive"
      });
    }

    const auditData: AuditData = {
      restaurantName,
      auditorName,
      auditDate,
      sections,
      totalItems: stats.totalItems,
      yesCount: stats.yesCount,
      noCount: stats.noCount,
      successPercentage: stats.successPercentage,
      status: 'completed'
    };

    setIsSubmitting(true);
    try {
      await onSubmit(auditData);
      toast({
        title: "Audit validé !",
        description: "L'audit a été enregistré avec succès et le rapport sera généré.",
      });
      
      // Reset form
      setRestaurantName('');
      setAuditorName('');
      setAuditDate(new Date().toISOString().split('T')[0]);
      setSections(AUDIT_SECTIONS.map(section => ({
        ...section,
        criteria: section.criteria.map(criteria => ({ ...criteria, response: undefined })),
        comments: ''
      })));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = calculateStats();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            AUDIT DE QUALITÉ RESTAURANT
          </CardTitle>
          <p className="text-muted-foreground">Contrôle des Standards de Qualité et d'Hygiène</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="auditor">Auditeur</Label>
              <Input
                id="auditor"
                placeholder="Nom de l'auditeur"
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="restaurant">Établissement</Label>
              <Input
                id="restaurant"
                placeholder="Nom du restaurant"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Instructions d'utilisation</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Cocher <strong>OUI</strong> si le critère est respecté</li>
                <li>• Cocher <strong>NON</strong> si le critère n'est pas respecté</li>
                <li>• Utiliser l'espace commentaires pour noter les observations spécifiques</li>
                <li>• Compléter toutes les sections pour un audit complet</li>
              </ul>
            </CardContent>
          </Card>

          {/* Progress Stats */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-primary">{stats.totalItems}</div>
                <div className="text-sm text-muted-foreground">Total critères</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">{stats.yesCount}</div>
                <div className="text-sm text-muted-foreground">OUI</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-red-600">{stats.noCount}</div>
                <div className="text-sm text-muted-foreground">NON</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-600">{stats.successPercentage}%</div>
                <div className="text-sm text-muted-foreground">Réussite</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Audit Sections */}
      {sections.map((section, sectionIndex) => (
        <Card key={section.name}>
          <CardHeader>
            <CardTitle className="text-xl text-primary">{section.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.criteria.map((criteria, criteriaIndex) => (
              <div key={criteria.id} className="space-y-2">
                <div className="text-sm font-medium">{criteria.criteria}</div>
                <div className="flex gap-4">
                  <Button
                    variant={criteria.response === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCriteriaResponse(sectionIndex, criteriaIndex, true)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    OUI
                  </Button>
                  <Button
                    variant={criteria.response === false ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleCriteriaResponse(sectionIndex, criteriaIndex, false)}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    NON
                  </Button>
                </div>
                <Separator />
              </div>
            ))}
            
            <div className="mt-6">
              <Label htmlFor={`comments-${sectionIndex}`}>
                Commentaires - {section.name}
              </Label>
              <Textarea
                id={`comments-${sectionIndex}`}
                placeholder="Observations spécifiques pour cette section..."
                value={section.comments || ''}
                onChange={(e) => handleSectionComment(sectionIndex, e.target.value)}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !restaurantName || !auditorName}
          className="flex items-center gap-2"
          size="lg"
        >
          {isSubmitting ? (
            <Clock className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          {isSubmitting ? 'Validation en cours...' : 'Valider l\'Audit'}
        </Button>
        
        <Button
          variant="outline"
          onClick={onViewHistory}
          className="flex items-center gap-2"
          size="lg"
        >
          <FileText className="h-5 w-5" />
          Consulter l'Historique
        </Button>
      </div>
    </div>
  );
};