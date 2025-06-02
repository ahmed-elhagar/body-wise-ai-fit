
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EnhancedShoppingListEmailRequest {
  userId: string;
  userEmail?: string;
  weekId: string;
  shoppingItems: Record<string, Array<{ name: string; quantity: number; unit: string }>>;
  weekRange: string;
  totalItems: number;
  categories: string[];
  language: string;
  generatedAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: EnhancedShoppingListEmailRequest = await req.json();
    console.log('📧 Enhanced shopping list email request:', {
      userId: requestData.userId,
      totalItems: requestData.totalItems,
      categories: requestData.categories?.length,
      language: requestData.language
    });

    // Handle test requests
    if ((requestData as any).test) {
      return new Response(JSON.stringify({ success: true, message: 'Email service is available' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { 
      userId, 
      userEmail, 
      weekId, 
      shoppingItems, 
      weekRange, 
      totalItems, 
      categories, 
      language,
      generatedAt 
    } = requestData;

    // Generate HTML content for the shopping list with enhanced formatting
    const categoriesHtml = Object.entries(shoppingItems)
      .map(([category, items]) => {
        const itemsHtml = items
          .map(item => `
            <li style="margin: 8px 0; padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 500;">${item.name}</span>
              <span style="color: #666; font-size: 14px;">${item.quantity} ${item.unit}</span>
            </li>
          `)
          .join('');
        return `
          <div style="margin-bottom: 30px; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
            <h3 style="color: #FF6F3C; background: linear-gradient(135deg, #FF6F3C 0%, #FF8A50 100%); color: white; padding: 15px; margin: 0; font-size: 18px; font-weight: 600;">
              ${category.toUpperCase()}
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0; background: #fafafa;">${itemsHtml}</ul>
          </div>
        `;
      })
      .join('');

    const isArabic = language === 'ar';
    const subject = isArabic 
      ? `قائمة التسوق - ${weekRange}`
      : `Your Shopping List - ${weekRange}`;

    const emailResponse = await resend.emails.send({
      from: "FitGenius <noreply@resend.dev>",
      to: [userEmail || `user-${userId}@example.com`],
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 700px; margin: 0 auto; background: #f8f9fa;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <header style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #FF6F3C; padding-bottom: 20px;">
              <h1 style="color: #FF6F3C; margin: 0; font-size: 28px; font-weight: 700;">
                ${isArabic ? 'قائمة التسوق الذكية' : 'Smart Shopping List'}
              </h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">${weekRange}</p>
            </header>
            
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
              <h2 style="margin: 0; color: #1976d2; font-size: 20px;">
                ${isArabic ? 'ملخص قائمة التسوق' : 'Shopping Summary'}
              </h2>
              <div style="display: flex; justify-content: space-around; margin-top: 15px; flex-wrap: wrap;">
                <div style="text-align: center; margin: 5px;">
                  <div style="font-size: 24px; font-weight: bold; color: #FF6F3C;">${totalItems}</div>
                  <div style="color: #666; font-size: 14px;">${isArabic ? 'عنصر' : 'Items'}</div>
                </div>
                <div style="text-align: center; margin: 5px;">
                  <div style="font-size: 24px; font-weight: bold; color: #4caf50;">${categories.length}</div>
                  <div style="color: #666; font-size: 14px;">${isArabic ? 'فئة' : 'Categories'}</div>
                </div>
              </div>
            </div>

            ${categoriesHtml}
            
            <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                ${isArabic 
                  ? `تم إنشاء هذه القائمة في ${new Date(generatedAt).toLocaleDateString('ar-SA')} بواسطة FitGenius`
                  : `Generated on ${new Date(generatedAt).toLocaleDateString()} by FitGenius`
                }
              </p>
              <p style="color: #FF6F3C; font-weight: 600; margin: 10px 0 0 0;">
                ${isArabic ? 'تسوق سعيد! 🛒' : 'Happy Shopping! 🛒'}
              </p>
            </footer>
          </div>
        </div>
      `,
    });

    console.log("✅ Enhanced shopping list email sent successfully:", {
      emailId: emailResponse.data?.id,
      totalItems,
      categories: categories.length
    });

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.data?.id,
      totalItems,
      categories: categories.length,
      message: isArabic 
        ? 'تم إرسال قائمة التسوق بنجاح'
        : 'Shopping list sent successfully'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in enhanced shopping list email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
