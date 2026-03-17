import { NextRequest } from "next/server"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// AI response templates based on common questions
const AI_RESPONSES: Record<string, string[]> = {
  en: [
    "Great question! Let me explain this concept step by step.\n\nThe key point here is that learning happens best when we break things into smaller parts. Think of it like eating a pizza - you don't eat the whole thing at once, you take one slice at a time!\n\nTo understand this better:\n1. First, identify what you already know\n2. Then, focus on one new thing at a time\n3. Practice with examples\n4. Review what you learned\n\nWould you like me to give you a specific example?",
    "I understand this might seem confusing at first. Let me simplify it for you.\n\nImagine you're learning to ride a bicycle. At first, it seems hard because you have to balance, pedal, and steer all at once. But when you break it down:\n- First, you learn to balance\n- Then, you add pedaling\n- Finally, you learn to steer\n\nThe same approach works for any topic! What specific part would you like me to explain more?",
    "This is a very common doubt that many students have!\n\nHere's the simple explanation:\n- The main concept works like a building block\n- Each new idea builds on previous ones\n- Practice helps connect these blocks together\n\nThink of it like learning a new language - first you learn letters, then words, then sentences. Soon you're having conversations!\n\nShall I create a quick quiz to test your understanding?",
  ],
  hi: [
    "बहुत अच्छा सवाल! मैं आपको यह स्टेप बाय स्टेप समझाता हूं।\n\nयहां मुख्य बात यह है कि सीखना तब सबसे अच्छा होता है जब हम चीजों को छोटे-छोटे हिस्सों में तोड़ते हैं। इसे ऐसे समझिए जैसे पिज्जा खाना - आप पूरा एक साथ नहीं खाते, एक-एक स्लाइस लेते हैं!\n\nइसे बेहतर समझने के लिए:\n1. पहले, पहचानिए कि आप पहले से क्या जानते हैं\n2. फिर, एक समय में एक नई चीज पर ध्यान दें\n3. उदाहरणों के साथ अभ्यास करें\n4. जो सीखा उसकी समीक्षा करें\n\nक्या आप चाहेंगे कि मैं एक विशिष्ट उदाहरण दूं?",
    "मैं समझता हूं कि यह पहले भ्रामक लग सकता है। मैं आपके लिए इसे सरल बनाता हूं।\n\nकल्पना कीजिए आप साइकिल चलाना सीख रहे हैं। शुरू में यह कठिन लगता है क्योंकि आपको एक साथ संतुलन, पेडल और स्टीयर करना होता है। लेकिन जब आप इसे तोड़ते हैं:\n- पहले, आप संतुलन सीखते हैं\n- फिर, आप पेडलिंग जोड़ते हैं\n- अंत में, आप स्टीयर करना सीखते हैं\n\nयही दृष्टिकोण किसी भी विषय के लिए काम करता है!",
  ],
  mr: [
    "खूप छान प्रश्न! मी तुम्हाला हे टप्प्याटप्प्याने समजावून सांगतो.\n\nइथे मुख्य मुद्दा हा आहे की शिकणे सर्वोत्तम तेव्हा होते जेव्हा आपण गोष्टी लहान भागांमध्ये मोडतो. पिझ्झा खाण्यासारखे विचार करा - तुम्ही संपूर्ण एकाच वेळी खात नाही, तुम्ही एकावेळी एक स्लाइस घेता!\n\nहे अधिक चांगल्या प्रकारे समजून घेण्यासाठी:\n1. प्रथम, तुम्हाला आधीच काय माहित आहे ते ओळखा\n2. मग, एका वेळी एका नवीन गोष्टीवर लक्ष केंद्रित करा\n3. उदाहरणांसह सराव करा\n4. तुम्ही काय शिकलात याचे पुनरावलोकन करा\n\nतुम्हाला मी विशिष्ट उदाहरण द्यावे असे वाटते का?",
    "मला समजते की हे सुरुवातीला गोंधळात टाकणारे वाटू शकते. मी तुमच्यासाठी सोपे करतो.\n\nकल्पना करा तुम्ही सायकल चालवायला शिकत आहात. सुरुवातीला कठीण वाटते कारण तुम्हाला एकाच वेळी संतुलन, पेडल आणि स्टीअर करावे लागते. पण जेव्हा तुम्ही मोडता:\n- प्रथम, तुम्ही संतुलन शिकता\n- मग, पेडलिंग जोडता\n- शेवटी, स्टीअरिंग शिकता\n\nहाच दृष्टिकोन कोणत्याही विषयासाठी कार्य करतो!",
  ],
  ta: [
    "மிகச்சிறந்த கேள்வி! இதை படிப்படியாக விளக்குகிறேன்.\n\nஇங்கே முக்கிய விஷயம் என்னவென்றால், விஷயங்களை சிறிய பகுதிகளாக பிரிக்கும்போது கற்றல் சிறப்பாக நடக்கும். பீட்சா சாப்பிடுவது போல் நினைத்துக்கொள்ளுங்கள் - நீங்கள் முழுவதையும் ஒரே நேரத்தில் சாப்பிடுவதில்லை, ஒரு ஸ்லைஸ் எடுக்கிறீர்கள்!\n\nஇதை நன்றாக புரிந்துகொள்ள:\n1. முதலில், உங்களுக்கு ஏற்கனவே என்ன தெரியும் என்பதை கண்டறியுங்கள்\n2. பிறகு, ஒரு நேரத்தில் ஒரு புதிய விஷயத்தில் கவனம் செலுத்துங்கள்\n3. உதாரணங்களுடன் பயிற்சி செய்யுங்கள்\n4. நீங்கள் கற்றுக்கொண்டதை மதிப்பாய்வு செய்யுங்கள்",
  ],
}

// Quiz templates
const QUIZ_TEMPLATES: Record<string, string> = {
  en: `Here's a quick quiz to test your understanding:

**Question 1:** What is the first step in learning any new concept?
A) Memorize everything at once
B) Identify what you already know
C) Skip to advanced topics
D) Give up if it's hard

**Question 2:** Why is breaking down concepts helpful?
A) It makes learning take longer
B) It helps avoid understanding
C) It makes complex topics manageable
D) It's not helpful at all

**Question 3:** What should you do after learning something new?
A) Forget it immediately
B) Never practice
C) Review and practice with examples
D) Move to something completely different

---
**Answers:** 1-B, 2-C, 3-C

How did you do? Feel free to ask me about any questions you got wrong!`,
  hi: `यहाँ आपकी समझ परखने के लिए एक त्वरित क्विज़ है:

**प्रश्न 1:** किसी भी नई अवधारणा सीखने में पहला कदम क्या है?
A) एक बार में सब कुछ याद करें
B) पहचानें कि आप पहले से क्या जानते हैं
C) उन्नत विषयों पर जाएं
D) अगर मुश्किल है तो हार मान लें

**प्रश्न 2:** अवधारणाओं को तोड़ना मददगार क्यों है?
A) इससे सीखने में अधिक समय लगता है
B) यह समझने से बचने में मदद करता है
C) यह जटिल विषयों को प्रबंधनीय बनाता है
D) यह बिल्कुल भी मददगार नहीं है

---
**उत्तर:** 1-B, 2-C

आपने कैसा किया? जिन प्रश्नों में आपने गलती की, उनके बारे में मुझसे पूछें!`,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, language = "en" } = body

    // Check if user is asking for a quiz
    const isQuizRequest = question.toLowerCase().includes("quiz") || 
                          question.toLowerCase().includes("test") ||
                          question.toLowerCase().includes("questions")

    let response: string

    if (isQuizRequest) {
      response = QUIZ_TEMPLATES[language] || QUIZ_TEMPLATES.en
    } else {
      // Get random response for the language
      const responses = AI_RESPONSES[language] || AI_RESPONSES.en
      response = responses[Math.floor(Math.random() * responses.length)]
    }

    // Create a readable stream that simulates typing effect
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Simulate typing by sending characters with small delays
        const words = response.split(" ")
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i < words.length - 1 ? " " : "")
          controller.enqueue(encoder.encode(word))
          // Small delay between words for typing effect
          await new Promise(resolve => setTimeout(resolve, 30))
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Error generating AI explanation:", error)
    
    return new Response(
      "I am here to help you learn! Please ask me any question about the video you are watching, and I will explain it in a simple way.",
      { status: 200 }
    )
  }
}
