(function (root, factory) {
  var api = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  root.chatbotUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var INTENTS = [
    {
      intent: 'greeting',
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'yo', 'sup', 'hola', 'howdy', 'hey there', 'how are you', "what's up", "how's it going"],
      patterns: [/\b(hi|hello|hey|how are you|how is it going|what's up|whats up|good morning|good afternoon|good evening|sup|hola|howdy|hey there)\b/i],
      response: 'Hi! I can help with repairs, services, training, location, hours, and contact details.'
    },
    {
      intent: 'repair_inquiry',
      keywords: ['repair', 'fix', 'broken', 'not working', "won't turn on", 'power issue', 'screen', 'battery', 'virus', 'slow', 'hardware', 'fault', 'issue', 'problem', 'motherboard', 'keyboard', 'charger', 'adapter', 'overheating', 'boot', 'startup', 'diagnose', 'diagnostic', 'malware'],
      patterns: [/\b(fix|repair|broken|not working|won't turn on|water damaged|screen|battery|virus|slow|fault|problem|issue|motherboard|keyboard|charger|adapter|overheating|boot|startup|diagnose|malware)\b/i],
      response: 'We repair laptops and desktops, replace damaged parts, clean malware, and help with everyday hardware issues. If you want, I can also help you decide the best next step for your device.'
    },
    {
      intent: 'services_inquiry',
      keywords: ['service', 'services', 'networking', 'cctv', 'camera', 'software development', 'solar', 'electrical', 'sales', 'supplies', 'hardware', 'website', 'hosting', 'website design', 'graphics', 'design', 'printing', 'branding', 'office setup', 'router', 'wifi', 'server', 'maintenance'],
      patterns: [/\b(what services|do you offer|can you do|what can you do|services do you provide|which services|service list|support)\b/i],
      response: 'We cover laptop and desktop repair, computer sales and supplies, website design and hosting, networking, software development, graphics design, CCTV, computer training, and solar and electrical services.'
    },
    {
      intent: 'training_inquiry',
      keywords: ['course', 'courses', 'class', 'classes', 'training', 'learn', 'teach', 'curriculum', 'cca', 'web design', 'website design', 'computer course', 'computer training', 'skills training'],
      patterns: [/\b(training|course|learn|class|classes|teach|academy|computer training|computer course)\b/i],
      response: 'Our professional training includes Computer Applications, Website Designing and Hosting, Networking and Network Administration, Hardware Repair, Graphics Design, and Business Software. Skills training covers industrial training, project management, presentation skills, and technology trends.'
    },
    {
      intent: 'fees_payment',
      keywords: ['fee', 'fees', 'cost', 'price', 'pricing', 'pay', 'payment', 'afford', 'charge', 'budget', 'cheap', 'affordable', 'expensive', 'discount'],
      patterns: [/\b(fee|fees|cost|price|pricing|payment|charge|how much|budget|affordable|cheap|discount|expensive)\b/i],
      response: 'Course fees are listed in the training fees structure. An advisor can share the latest pricing and intake dates when you contact us. We also help customers choose options that fit their budget.'
    },
    {
      intent: 'enrollment_process',
      keywords: ['enroll', 'enrol', 'register', 'sign up', 'signup', 'apply', 'join', 'how do i start', 'admission', 'enrollment'],
      patterns: [/\b(enroll|enrol|register|sign up|signup|apply|join|admission|how do i start|how can i join)\b/i],
      response: 'You can apply directly through Codinex Academy online, or contact us at +256 756 198 585 / info@codinex.co.ug and an advisor will guide you through enrollment.'
    },
    {
      intent: 'schedule_hours',
      keywords: ['schedule', 'hours', 'open', 'opening', 'closing', 'time', 'when', 'weekend', 'today', 'tomorrow'],
      patterns: [/\b(open|closing|hours|when\s+are|what time|today|tomorrow|weekday|weekend)\b/i],
      response: 'We are generally open Monday to Friday from 8:30 AM to 5:30 PM, and Saturday from 9:00 AM to 5:00 PM.'
    },
    {
      intent: 'location',
      keywords: ['location', 'where', 'address', 'visit', 'office', 'mbarara', 'directions', 'map', 'located', 'near'],
      patterns: [/\b(where|located|address|directions|how do i get|map|nearest)\b/i],
      response: 'We are located at Mbarara City Mall, Level 2, Room 33, Buremba Road, Mbarara City, Uganda.'
    },
    {
      intent: 'industrial_training',
      keywords: ['industrial training', 'internship', 'placement', 'attachment', 'student', 'practical training', 'work experience'],
      patterns: [/\b(internship|industrial training|placement|attachment|student|practical training|work experience)\b/i],
      response: 'We host industrial training placements for IT, Computer Science, Computer Engineering, and Software Engineering students in two intakes each year: May to July and October to December.'
    },
    {
      intent: 'beginner_friendly',
      keywords: ['beginner', 'experience', 'no experience', 'never used', 'new to computers', 'basic', 'first time', 'novice'],
      patterns: [/\b(beginner|no experience|never used|new to computers|basic|first time|novice|easy)\b/i],
      response: 'Yes. Our Computer Applications course is designed for beginners and anyone who wants to build confidence with everyday computer skills.'
    },
    {
      intent: 'about_company',
      keywords: ['who are you', 'about codinex', 'founded', 'history', 'since when', 'years', 'company', 'about you', 'what is codinex'],
      patterns: [/\b(who are you|about codinex|founded|history|since when|what is codinex|about you|years)\b/i],
      response: 'Codinex Computers Ltd was founded in Mbarara in 2012 by IT professionals and computer engineers, and it now serves thousands of customers each year.'
    },
    {
      intent: 'contact_support',
      keywords: ['contact', 'phone', 'call', 'email', 'reach', 'advisor', 'support', 'whatsapp', 'number', 'help', 'message', 'chat', 'consultation', 'book'],
      patterns: [/\b(contact|phone|call|email|reach|support|whatsapp|number|help|get in touch|message|consultation|book)\b/i],
      response: 'You can call +256 756 198 585 or +256 776 479 173, email info@codinex.co.ug, or use the contact form on this page to book a consultation.'
    },
    {
      intent: 'thanks',
      keywords: ['thank', 'thanks', 'appreciate', 'cool', 'great', 'awesome', 'thank you'],
      patterns: [/\b(thank|thanks|appreciate|great|awesome)\b/i],
      response: 'You are welcome. I am happy to help with anything else about our services or training.'
    },
    {
      intent: 'general_support',
      keywords: ['can you help', 'i need help', 'assist me', 'what do you know', 'information', 'recommend', 'suggest', 'advice', 'guide', 'best', 'which one', 'should i choose', 'what should i do'],
      patterns: [/\b(can you help|i need help|assist me|what do you know|recommend|suggest|advice|guide|best|which one|should i choose|what should i do)\b/i],
      response: 'I can help you choose the right service, explain our training, guide you to the best next step, and share contact details for follow-up.'
    },
    {
      intent: 'business_support',
      keywords: ['office', 'business', 'company', 'school', 'hospital', 'hotel', 'institution', 'organization', 'team', 'staff', 'work', 'workflow', 'digitize', 'management', 'records'],
      patterns: [/\b(office|business|company|school|hospital|hotel|institution|organization|team|staff|workflow|digitize|records|management)\b/i],
      response: 'We support businesses, schools, hospitals, hotels, and other institutions with reliable computer systems, software, networking, and training.'
    }
  ];

  var FALLBACK = 'I did not catch that clearly. You can ask about repairs, training, location, hours, industrial training, or contact details.';

  function cleanText(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isGreetingOnly(rawText) {
    return /^\s*(hi|hello|hey|yo|sup|hola|howdy|hey there|good morning|good afternoon|good evening|how are you|how's it going|what's up|whats up)\s*([,!?\.])*\s*$/i.test(rawText);
  }

  function predictIntent(rawText) {
    var text = cleanText(rawText);
    if (!text) return null;
    var bestIntent = null;
    var bestScore = 0;
    var bestNonGreetingIntent = null;
    var bestNonGreetingScore = 0;

    var greetingRe = /(^|[\s,!?\.])(hi|hello|hey|yo|sup|hola|howdy|hey there|good morning|good afternoon|good evening|how are you|how's it going|whats up|what's up)(?=$|[\s,!?\.])/i;
    var hasGreeting = greetingRe.test(rawText);

    INTENTS.forEach(function (entry) {
      var score = 0;

      // pattern matching (regex) — higher weight for clear pattern matches
      if (entry.patterns && Array.isArray(entry.patterns)) {
        for (var pi = 0; pi < entry.patterns.length; pi++) {
          try {
            if (entry.patterns[pi].test(rawText)) score += 8;
          } catch (e) {}
        }
      }

      entry.keywords.forEach(function (keyword) {
        var cleanedKeyword = cleanText(keyword);
        if (!cleanedKeyword) return;

        if (text.indexOf(cleanedKeyword) !== -1) {
          score += cleanedKeyword.split(' ').length * 2;
        }

        if (text === cleanedKeyword || text.indexOf(cleanedKeyword + ' ') !== -1 || text.indexOf(' ' + cleanedKeyword) !== -1) {
          score += 3;
        }
      });

      if (entry.intent === 'fees_payment' && /\b(how much|price|cost|fee|fees|charge|pricing)\b/i.test(rawText)) {
        score += 6;
      }

      if (entry.intent === 'beginner_friendly' && /\b(beginner|beginner friendly|no experience|first time|new to computers|novice|easy)\b/i.test(rawText)) {
        score += 6;
      }

      if (entry.intent === 'general_support' && /\b(help|assist|advice|guide|recommend|suggest|question|problem|best|which one|should i|what should|can you|need help)\b/i.test(rawText)) {
        score += 8;
      }

      if (score > bestScore) {
        bestScore = score;
        bestIntent = entry;
      }
      if (entry.intent !== 'greeting' && score > bestNonGreetingScore) {
        bestNonGreetingScore = score;
        bestNonGreetingIntent = entry;
      }
    });

    // If the user says a greeting plus another question, prefer the stronger non-greeting intent.
    if (hasGreeting && !isGreetingOnly(rawText) && bestNonGreetingIntent && bestNonGreetingScore >= 6) {
      return bestNonGreetingIntent;
    }

    if (hasGreeting && isGreetingOnly(rawText)) {
      return INTENTS.find(function (it) { return it.intent === 'greeting'; });
    }

    if (bestIntent && bestIntent.intent === 'greeting' && !isGreetingOnly(rawText)) {
      return bestNonGreetingIntent || null;
    }

    return bestScore >= 2 ? bestIntent : null;
  }

  function chatbotReply(message) {
    var match = predictIntent(message);
    if (!match) return FALLBACK;

    var startsWithGreeting = /(^|\s)(hi|hello|hey|yo|sup|hola|howdy|good morning|good afternoon|good evening)([\s,!?.]|$)/i.test(message);
    if (startsWithGreeting && match.intent !== 'greeting') {
      return 'Hi there! ' + match.response;
    }

    return match.response;
  }

  function getSuggestedReplies() {
    return [
      'What services do you offer?',
      'What courses do you train?',
      'Where are you located?',
      'Do you offer industrial training?',
      'Can you help with a laptop that won\'t turn on?',
      'How do I register for training?',
      'Do you support businesses and schools?'
    ];
  }

  return {
    INTENTS: INTENTS,
    predictIntent: predictIntent,
    chatbotReply: chatbotReply,
    getSuggestedReplies: getSuggestedReplies
  };
});

// --- Client-side dataset matcher fallback ---
(function () {
  var localIndex = null;

  function parseCSV(text) {
    var lines = text.split(/\r?\n/);
    var rows = [];
    var header = lines.shift().split(',');
    lines.forEach(function (line) {
      if (!line.trim()) return;
      // naive CSV parse: split on comma but keep quoted fields together
      var parts = line.match(/("[^"]*"|[^,]+)/g) || [];
      parts = parts.map(function (p) { return p.replace(/^"|"$/g, '').trim(); });
      var obj = {};
      for (var i = 0; i < header.length; i++) obj[header[i]] = parts[i] || '';
      rows.push(obj);
    });
    return rows;
  }

  function clean(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function tokenize(s) { return clean(s).split(' ').filter(Boolean); }

  function buildLocalIndex() {
    if (localIndex) return Promise.resolve(localIndex);
    return fetch('Bitext_Sample_Customer_Support_Training_Dataset_27K_responses-v11.csv')
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var rows = parseCSV(txt);
        localIndex = rows.map(function (r) {
          return {
            instruction: r.instruction || '',
            intent: r.intent || '',
            response: r.response || '',
            tokens: tokenize(r.instruction + ' ' + r.response)
          };
        });
        return localIndex;
      })
      .catch(function () { localIndex = []; return localIndex; });
  }

  function scoreOverlap(aTokens, bTokens) {
    var setB = new Set(bTokens);
    var common = aTokens.reduce(function (acc, t) { return acc + (setB.has(t) ? 1 : 0); }, 0);
    return common / Math.max(1, bTokens.length);
  }

  function searchLocalDataset(query, topN) {
    topN = topN || 3;
    return buildLocalIndex().then(function (idx) {
      var qTokens = tokenize(query);
      var scored = idx.map(function (row) {
        var s1 = scoreOverlap(qTokens, row.tokens);
        var s2 = scoreOverlap(row.tokens, qTokens);
        var keywordBoost = 0;
        if (/(repair|fix|broken|laptop|desktop|computer)/i.test(query)) keywordBoost += 0.05;
        if (/(training|course|learn|academy|class)/i.test(query)) keywordBoost += 0.05;
        if (/(contact|call|email|phone|address|location|where)/i.test(query)) keywordBoost += 0.05;
        if (/(business|school|hospital|hotel|office|institution)/i.test(query)) keywordBoost += 0.05;
        return { row: row, score: Math.max(s1, s2) + keywordBoost };
      });
      scored.sort(function (a, b) { return b.score - a.score; });
      return scored.slice(0, topN).filter(function (s) { return s.score > 0.12; }).map(function (s) { return s.row; });
    });
  }

  // Export fallback functions onto global chatbotUtils when available
  if (typeof window !== 'undefined') {
    window.chatbotUtils = window.chatbotUtils || {};
    window.chatbotUtils.searchLocalDataset = searchLocalDataset;
    // wrap existing chatbotReply to consult local dataset when no static intent
    var originalReply = (window.chatbotUtils && window.chatbotUtils.chatbotReply) || function (m) { return ""; };
    window.chatbotUtils.chatbotReply = function (message) {
      var intent = (window.chatbotUtils && window.chatbotUtils.predictIntent) ? window.chatbotUtils.predictIntent(message) : null;
      if (intent) return intent.response;

      // Try server if available
      if (window.fetch) {
        try {
          return fetch('/api/query', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: message })
          }).then(function (r) {
            if (!r.ok) throw new Error('no server');
            return r.json();
          }).then(function (data) {
            if (data && data.answer) return data.answer;
            return searchLocalDataset(message, 1).then(function (rows) {
              if (rows && rows.length) return rows[0].response;
              return originalReply(message) || 'Sorry, I didn\'t get that. Could you rephrase?';
            });
          }).catch(function () {
            return searchLocalDataset(message, 1).then(function (rows) {
              if (rows && rows.length) return rows[0].response;
              return originalReply(message) || 'Sorry, I didn\'t get that.';
            });
          });
        } catch (e) {
          // fall through to local search
        }
      }

      return searchLocalDataset(message, 1).then(function (rows) {
        if (rows && rows.length) return rows[0].response;
        // fallback to original reply or generic fallback
        return originalReply(message) || 'Sorry, I didn\'t get that. Could you rephrase?';
      }).catch(function () { return originalReply(message) || 'Sorry, I didn\'t get that.'; });
    };
  }
})();
