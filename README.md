# জ্ঞানবিজ্ঞান — লাইভ ওয়েবসাইট প্রজেক্ট

## কী আছে
- বাংলা, মোবাইল-উপযোগী শিক্ষামূলক হোমপেজ
- `/api/ask` AI প্রশ্নোত্তর endpoint (সার্ভারে OpenAI API key লাগবে)
- `/api/submissions` লেখা জমা endpoint; ডিফল্ট স্ট্যাটাস `pending`
- `/api/admin/submissions` অ্যাডমিন রিভিউ endpoint (ADMIN_TOKEN দিয়ে সুরক্ষিত)

## লোকাল কম্পিউটার বা Node.js hosting-এ চালানো
1. Node.js 18+ ইনস্টল করো।
2. টার্মিনালে প্রজেক্ট ফোল্ডারে গিয়ে `npm install` চালাও।
3. `public/index.html` খুলে ব্রাউজারে দেখতে চাইলে সার্ভার চালানো ভালো।
4. `OPENAI_API_KEY` এবং `ADMIN_TOKEN` environment variables সেট করো।
5. `npm start` চালাও।

### উদাহরণ (Linux/macOS shell)
```bash
export OPENAI_API_KEY="তোমার_API_KEY"
export ADMIN_TOKEN="দীর্ঘ-এলোমেলো-গোপন-টোকেন"
npm install
npm start
```

Windows PowerShell-এ environment variable সেট করার পদ্ধতি আলাদা।

## বিনামূল্যে প্রকাশ
Render, Railway, Fly.io বা অন্য Node.js host-এ deploy করা যায়; free tier, database persistence, sleep limits এবং AI API খরচ সময়ের সঙ্গে বদলাতে পারে। Deploy করার আগে তাদের বর্তমান শর্ত দেখো। API key কখনো `public` ফোল্ডার বা HTML-এ রেখো না। Production-এ JSON ফাইলের বদলে managed database ব্যবহার করো; hosting-এর ephemeral filesystem-এ submissions হারিয়ে যেতে পারে।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
- এই প্রজেক্ট নিজে থেকে ইন্টারনেটে প্রকাশিত নয়। Hosting account-এ deploy করতে হবে।
- AI-কে “পৃথিবীর সব প্রশ্নের সঠিক উত্তর” দেওয়ার নিশ্চয়তা দেওয়া যায় না। উত্তর যাচাই করার বার্তা দেখানো আছে।
- অ্যাডমিন API-তে `ADMIN_TOKEN` বাধ্যতামূলক, কিন্তু এটি পূর্ণাঙ্গ অ্যাডমিন UI নয়; production-এর আগে rate limiting, spam protection, persistent database, logging, privacy policy এবং আরও শক্তিশালী authentication যোগ করা উচিত।
- এই স্টার্টার প্রজেক্টে লেখা public page-এ auto-publish হয় না; submission-গুলো pending থাকে।
