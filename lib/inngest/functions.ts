import { inngest } from "@/lib/inngest/client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { success } from "better-auth";
import { sendWelcomeEmail } from "../nodemailer";


export const sendSignUpEmail = inngest.createFunction(
    {id: 'sign-up-email'},
    {event:'app/user.creted'},
    async({event,step})=>{
        const userProfile = `
              - country: ${event.data.country}
              - investment goals: ${event.data.investmentGoals}
              - Risk tolerance: ${event.data.riskTolerance}
              - Preferred industry: ${event.data.PreferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}',userProfile);

        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models({model:'gemini-2.5-flash-lite'}),
                body: {
                    contents: [
                        {
                            role:'user',
                            parts:[
                                {text:prompt}
                            ]
                        
                        }]
                
                    }
            
        })

        await step.run('send-welcome-email',async()=>{
                const part = response.candidates?.[0]?.content?.parts?.[0];
                const introText = (part && 'text' in part ? part.text : null) || 'Welcome to Sphere! We are excited to have you on board.';


            const {data:{email, name}} = event;
            return await sendWelcomeEmail({
                email,name,introText
            })

        })
        return{
            success:true,
            message:'Welcome email sent successfully'
        }

    }
)