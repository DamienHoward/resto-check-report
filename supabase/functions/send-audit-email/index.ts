import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  auditId: string;
  recipientEmail: string;
  auditData: {
    restaurantName: string;
    auditorName: string;
    auditDate: string;
    successPercentage: number;
    yesCount: number;
    noCount: number;
    totalItems: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { auditData, recipientEmail }: EmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Audit Restaurant <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Rapport d'audit - ${auditData.restaurantName}`,
      html: `
        <h1>Rapport d'Audit de Qualité Restaurant</h1>
        <h2>${auditData.restaurantName}</h2>
        
        <p><strong>Auditeur:</strong> ${auditData.auditorName}</p>
        <p><strong>Date:</strong> ${auditData.auditDate}</p>
        
        <h3>Résultats</h3>
        <ul>
          <li><strong>Score global:</strong> ${auditData.successPercentage}%</li>
          <li><strong>Critères validés:</strong> ${auditData.yesCount}</li>
          <li><strong>Critères non validés:</strong> ${auditData.noCount}</li>
          <li><strong>Total critères:</strong> ${auditData.totalItems}</li>
        </ul>
        
        <p>Consultez l'application pour voir le rapport détaillé et les recommandations d'amélioration.</p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Erreur envoi email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);