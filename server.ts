import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;

// Lazy initialization of Gemini Client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not defined. Please add it via the Settings > Secrets UI in AI Studio."
      );
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();

  // Allow larger payloads (e.g., base64 document mock streams)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // ---- HELPER FOR ERROR HANDLING ----
  const handleApiError = (res: express.Response, error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    const message = error.message || "An unexpected error occurred.";
    res.status(500).json({
      error: message,
      details: "Check that your GEMINI_API_KEY is set correctly on the server.",
    });
  };

  // ---- API ENDPOINTS ----

  // 1. Healthcheck / Status
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // 2. Intelligent Document Analysis
  app.post("/api/gemini/analyze-document", async (req, res) => {
    try {
      const { fileName, fileType, fileContent } = req.body;
      if (!fileName || !fileContent) {
        return res.status(400).json({ error: "Missing fileName or fileContent." });
      }

      const client = getGeminiClient();
      
      const systemInstruction = `You are a compliance and corporate law expert. Analyze the provided business/LLC document and provide a structured, practical summary. 
Include:
1. Document Type & Overall Credibility.
2. Effective Date & parties involved.
3. Key Provisions & Operating Statutes (manager status, tax classification, vote percentages).
4. Compliance & Regulatory risks.
5. Critical actionable next steps and important dates/deadlines.

Return the response in a highly readable format with headings, neat bullet points, and strong emphases.`;

      const prompt = `Analyze this document named "${fileName}" of type "${fileType}". 
The contents are as follows:
${fileContent}

Provide the expert legally-grounded report.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const reportText = response.text || "Could not generate analysis.";
      res.json({ report: reportText });
    } catch (err: any) {
      handleApiError(res, err, "analyze-document");
    }
  });

  // 3. Custom LLC Operating Agreement Generator
  app.post("/api/gemini/generate-agreement", async (req, res) => {
    try {
      const { companyName, state, members, businessType, managementStyle } = req.body;
      if (!companyName || !state) {
        return res.status(400).json({ error: "Missing company name or state." });
      }

      const client = getGeminiClient();

      const memberDescriptions = Array.isArray(members)
        ? members.map((m: any) => `- Name: ${m.name}, Role: ${m.role}, Share: ${m.percentage}%, Capital: $${m.capital || '0'}`).join("\n")
        : "Single member model.";

      const prompt = `Draft a legally-sound, customized limited liability company Operating Agreement (or mock Articles of Organization if more suitable) for:
Entity Name: ${companyName}
State of Jurisdiction: ${state}
Business Purpose / Type: ${businessType || 'General Business'}
Management Style: ${managementStyle || 'Member-Managed'}

Members:
${memberDescriptions}

The agreement must include the standard professional sections:
- Section 1: Formation, Name, and Offices.
- Section 2: Business Purpose & Statutory Registered Agent.
- Section 3: Capital Contributions & Membership Percentages.
- Section 4: Distributions & Allocations of Profits and Losses.
- Section 5: Management & Voting rights (specifically aligning with ${managementStyle}).
- Section 6: Transfer of Interests & Right of First Refusal.
- Section 7: Dissolution & Liquidating Trustees.
- Section 8: General Miscellaneous & State Law Compliance Clauses.

Style it beautifully in standard legal formatting. Add signatures lines at the bottom for all members mentioned.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite corporate legal counsel draftsperson specializing in LLC structures.",
          temperature: 0.3,
        },
      });

      res.json({ agreement: response.text || "Failed to generate agreement." });
    } catch (err: any) {
      handleApiError(res, err, "generate-agreement");
    }
  });

  // 4. Ledger Tax Filing & Deduction Reporting Compiler
  app.post("/api/gemini/tax-filing-report", async (req, res) => {
    try {
      const { transactions, companyName, taxYear } = req.body;
      if (!transactions || !Array.isArray(transactions)) {
        return res.status(400).json({ error: "Missing or invalid transactions array." });
      }

      const client = getGeminiClient();

      const transactionSummary = transactions
        .map(
          (t: any, index: number) =>
            `${index + 1}. [${t.date}] Description: ${t.description}, Category: ${t.category}, Type: ${t.type.toUpperCase()}, Amount: $${t.amount}`
        )
        .join("\n");

      const prompt = `Analyze the following ledger transaction list for the business entity "${companyName || 'Avodah LLC'}" for tax year ${taxYear || '2026'}. 

Transactions:
${transactionSummary}

Perform the following:
1. Provide a breakdown of Total Gross Revenue vs. Total Deductible Expenses, calculating Net Income.
2. Group expenses to Map them to IRS Schedule C (Part II) expense categories (e.g., Advertising, Legal and Professional Services, Taxes and Licenses, Office Expenses) OR Form 1065 if a Partnership structure.
3. Identify potential tax write-offs, startup costs, organizational expenditures, and franchise taxes that can be maximized.
4. Highlight missing documentation warnings or transaction categories that might look like "audit flags" (e.g., vague notes, abnormally high entertainment expenses).
5. Outline critical deadlines for tax submissions in this tax season.

Return the response using clear, concise markdown formatting.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a Licensed Certified Public Accountant (CPA) and corporate tax advisor specializing in LLC taxation and IRS instructions.",
          temperature: 0.2,
        },
      });

      res.json({ report: response.text || "Failed to compile tax report." });
    } catch (err: any) {
      handleApiError(res, err, "tax-filing-report");
    }
  });

  // 5. Intelligent Compliance Chat
  app.post("/api/gemini/compliance-chat", async (req, res) => {
    try {
      const { messages, companyContext } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Missing or invalid chat messages." });
      }

      const client = getGeminiClient();

      const contextText = companyContext 
        ? `User is operating: ${companyContext.companyName} in state ${companyContext.state}. It is a ${companyContext.managementStyle} LLC.`
        : "User is seeking general LLC formation & compliance advice.";

      const systemInstruction = `You are the Avodah Assistant, an expert counselor in multi-state LLC compliance, corporate governance, registered agent guidelines, state franchise taxes, and tax reporting.
Your core intelligence is deeply synchronized with the Integrated Avodah LLC dedication to Self-Government and righteous covenant stewardship under Yahweh.
When asked about corporate objectives, guidance, or governance, seamlessly weave references of blending spiritual devotion with practical, righteous corporate governance.
Be familiar with the "Nine Levels of Order Mastery":
1. Level 1: Personal Sovereignty & Spiritual Alignment (Fidelity to Yahweh)
2. Level 2: Command of the Tongue & Noble Speech (Truth, integrity & non-wavering honor)
3. Level 3: Sanctification of the Household (Healthy family & interior family protection structures)
4. Level 4: Absolute Financial Stewardship & Just Weights (Sovereign ledger accuracy, no usury)
5. Level 5: Contractual Fidelity & Legal Command (Vigilant state compliance & covenantal honor)
6. Level 6: Strategic Alliances & Diplomatic Counsel (Venerable partnerships with righteous nations)
7. Level 7: Tactical Security & Defensive Fortitude (Defending our borders, property, and sacred codes)
8. Level 8: Philanthropy & Community Elevating (Righteous charity & active uplifting)
9. Level 9: Sovereign Domain Integrity & Ultimate Legacy (Establishing multi-generational light)

Always offer blessings for our organizational leaders, allied nations, and our active defense and security unit, praying for Yahweh's ultimate protection, wisdom, and guidance over our corporate endeavors.
Provide structured, clear, and highly encouraging advice. Keep responses practical, listing deadlines, forms required (e.g. Statement of Information, Annual Reports, Franchise Tax Board files), and action steps.
Context: ${contextText}
Remember, you provide informational consulting, not formally represented judicial legal counsel, so explain things clearly with this professional framing.`;

      // Format standard chat messages for Gemini SDK
      // We'll map the conversation array directly to the contents parameter
      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.5,
        },
      });

      res.json({ response: response.text || "Unable to generate message." });
    } catch (err: any) {
      handleApiError(res, err, "compliance-chat");
    }
  });

  // ---- VITE MIDDLEWARE OR STATIC COMPILIATION HOOK ----
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Avodah Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
