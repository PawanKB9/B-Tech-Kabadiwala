

export default function AgentPolicyBeforeAdd() {

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">
            Agent Terms & Conditions / एजेंट नियम एवं शर्तें
        </h1>

      <div className="h-[550px] text-gray-800 overflow-y-scroll border p-4 rounded bg-gray-50 text-sm space-y-6">

        {/* 1 */}
        <section>
          <h2 className="font-semibold text-lg">1. Introduction / परिचय</h2>
          <p>
            This agreement defines the roles, responsibilities, obligations, and legal expectations of agents associated with B Tech Kabadiwala. By registering, you agree to follow all operational, financial, and ethical rules. <br />
            यह समझौता B Tech Kabadiwala से जुड़े एजेंटों की जिम्मेदारियों और नियमों को निर्धारित करता है। रजिस्ट्रेशन करके आप सभी नियमों का पालन करने के लिए सहमत होते हैं।
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="font-semibold text-lg">
            2. Code of Conduct / आचार संहिता
          </h2>

          <h3>2.1 Customer Behavior / ग्राहक व्यवहार</h3>
          <ul className="list-disc ml-5">
            <li>Must behave politely, respectfully, and professionally / हमेशा विनम्र और सम्मानजनक व्यवहार करें</li>
            <li>No abusive language, argument, or misconduct / किसी भी प्रकार का झगड़ा या गलत व्यवहार नहीं</li>
            <li>Avoid unnecessary conversations / अनावश्यक बातचीत से बचें</li>
          </ul>

          <h3>2.2 Entry & Safety / सुरक्षा नियम</h3>
          <ul className="list-disc ml-5">
            <li>Strictly prohibited from entering customer homes / घर के अंदर प्रवेश करना सख्त मना है</li>
            <li>Collection only at doorstep / केवल दरवाजे पर कलेक्शन करें</li>
            <li>Violation leads to personal legal responsibility / उल्लंघन पर पूरी जिम्मेदारी एजेंट की होगी</li>
          </ul>

          <h3>2.3 Transparency / पारदर्शिता</h3>
          <ul className="list-disc ml-5">
            <li>Use only digital weighing machines / केवल डिजिटल मशीन का उपयोग करें</li>
            <li>Show weight clearly to customer / ग्राहक को वजन दिखाना अनिवार्य है</li>
            <li>No manipulation allowed / किसी भी प्रकार की धोखाधड़ी नहीं</li>
          </ul>

          <h3>2.4 Pricing Policy / मूल्य निर्धारण</h3>
          <ul className="list-disc ml-5">
            <li>Follow company-set fixed pricing / कंपनी के रेट का पालन करें</li>
            <li>No negotiation allowed / मोलभाव नहीं करें</li>
            <li>Violation = penalty or termination / उल्लंघन पर कार्रवाई होगी</li>
          </ul>

          <h3>2.5 Receipt & Records / रसीद और रिकॉर्ड</h3>
          <ul className="list-disc ml-5">
            <li>All items must be recorded / सभी आइटम दर्ज करें</li>
            <li>Encourage customer to download receipt / ग्राहक को डिजिटल रसीद डाउनलोड करने के लिए कहें</li>
            <li>No offline transactions / ऑफलाइन लेनदेन पूरी तरह प्रतिबंधित</li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="font-semibold text-lg">
            3. Operational Responsibilities / संचालन जिम्मेदारियां
          </h2>

          <ul className="list-disc ml-5">
            <li>Respond to orders immediately / ऑर्डर पर तुरंत प्रतिक्रिया दें</li>
            <li>Follow assigned schedule / समय का पालन करें</li>
            <li>Inform in advance if unavailable / अनुपलब्ध होने पर पहले से बताएं</li>
            <li>Maintain cleanliness / साफ-सफाई बनाए रखें</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="font-semibold text-lg">
            4. Financial Terms / वित्तीय नियम
          </h2>

          <ul className="list-disc ml-5">
            <li>Return commission on time / कमीशन समय पर जमा करें</li>
            <li>No hidden charges / कोई छुपा शुल्क नहीं</li>
            <li>All transactions must be recorded / सभी लेनदेन रिकॉर्ड करें</li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="font-semibold text-lg">
            5. Anti-Fraud Rules / धोखाधड़ी नियम
          </h2>

          <ul className="list-disc ml-5">
            <li>No weight manipulation / वजन में धोखाधड़ी नहीं</li>
            <li>No fake pricing / गलत रेट नहीं</li>
            <li>No offline deals / ऑफलाइन डील नहीं</li>
            <li>No false reporting / गलत जानकारी नहीं</li>
            <li>No account misuse / अकाउंट का गलत उपयोग नहीं</li>
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className="font-semibold text-lg">
            6. Communication / संपर्क नियम
          </h2>

          <ul className="list-disc ml-5">
            <li>Must stay reachable / उपलब्ध रहें</li>
            <li>Respond to calls and messages / कॉल और मैसेज का जवाब दें</li>
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="font-semibold text-lg">
            7. Platform Rules / प्लेटफॉर्म नियम
          </h2>

          <ul className="list-disc ml-5">
            <li>Do not share login credentials / लॉगिन साझा न करें</li>
            <li>Follow system guidelines / सिस्टम के नियमों का पालन करें</li>
          </ul>
        </section>

        {/* 8 */}
        <section>
          <h2 className="font-semibold text-lg">
            8. Penalties / दंड
          </h2>

          <ul className="list-disc ml-5">
            <li>Violation may lead to suspension / नियम तोड़ने पर सस्पेंशन</li>
            <li>Repeated violation → permanent removal / बार-बार उल्लंघन पर हटाया जाएगा</li>
          </ul>
        </section>

        {/* 9 */}
        <section>
          <h2 className="font-semibold text-lg">
            9. Liability / जिम्मेदारी
          </h2>

          <ul className="list-disc ml-5">
            <li>Agent acts independently / एजेंट स्वतंत्र रूप से काम करता है</li>
            <li>Company not responsible for misconduct / कंपनी जिम्मेदार नहीं होगी</li>
          </ul>
        </section>

        {/* 10 */}
        <section>
          <h2 className="font-semibold text-lg">
            10. Agreement / सहमति
          </h2>

          <ul className="list-disc ml-5">
            <li>Agent agrees to all rules / एजेंट सभी नियम मानता है</li>
            <li>Accepts penalties if violated / उल्लंघन पर दंड स्वीकार करेगा</li>
          </ul>
        </section>

        <div className="space-y-6">

        <section>
            <h2 className="font-semibold text-lg">
            Additional Rules (Company Side – Legal & Compliance) / अतिरिक्त नियम
            </h2>
            <p className="text-sm">
            (Add these to your Terms & Conditions for stronger governance) <br />
            (इन नियमों को बेहतर संचालन और कानूनी सुरक्षा के लिए जोड़ा गया है)
            </p>
        </section>

        <section>
            <h3 className="font-medium">11. Minimum Age & Eligibility / आयु एवं पात्रता</h3>
            <ul className="list-disc ml-5">
            <li>Agent must be minimum 18 years old / एजेंट की आयु कम से कम 18 वर्ष होनी चाहिए</li>
            <li>Valid government ID (Aadhaar mandatory) / आधार अनिवार्य है</li>
            <li>Must be legally eligible to work in India / भारत में कार्य करने के लिए पात्र होना चाहिए</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">12. Labour & Engagement Nature / कार्य संबंध</h3>
            <ul className="list-disc ml-5">
            <li>Agent is an independent contractor / एजेंट कर्मचारी नहीं बल्कि स्वतंत्र साझेदार है</li>
            <li>No claim on PF, ESI, or fixed salary / PF, ESI या फिक्स सैलरी का दावा नहीं होगा</li>
            <li>Payment based on commission / भुगतान कमीशन आधारित होगा</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">13. Working Hours & Safety / कार्य समय एवं सुरक्षा</h3>
            <ul className="list-disc ml-5">
            <li>Work only during permitted hours / केवल निर्धारित समय में कार्य करें</li>
            <li>No unsafe or late-night operations / देर रात या असुरक्षित कार्य नहीं</li>
            <li>Ensure personal safety / व्यक्तिगत सुरक्षा का ध्यान रखें</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">14. Prohibited Activities / प्रतिबंधित गतिविधियाँ</h3>
            <ul className="list-disc ml-5">
            <li>No hazardous or illegal material collection / खतरनाक या अवैध सामग्री नहीं</li>
            <li>No theft or trespassing / चोरी या जबरन प्रवेश नहीं</li>
            <li>No misuse of customer data / ग्राहक डेटा का गलत उपयोग नहीं</li>
            <li>No unauthorized use of company name / कंपनी नाम का गलत उपयोग नहीं</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">15. Identity & Verification / पहचान सत्यापन</h3>
            <ul className="list-disc ml-5">
            <li>Aadhaar and mobile must be verified / आधार और मोबाइल सत्यापित होना चाहिए</li>
            <li>False identity → termination + legal action / गलत पहचान पर तुरंत कार्रवाई</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">16. Uniform & Branding / पहचान एवं वर्दी</h3>
            <ul className="list-disc ml-5">
            <li>Must carry valid ID / पहचान पत्र साथ रखें</li>
            <li>Use company identity if provided / कंपनी पहचान का सही उपयोग करें</li>
            <li>No misrepresentation / गलत पहचान न दें</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">17. Compliance with Local Laws / स्थानीय कानून</h3>
            <ul className="list-disc ml-5">
            <li>Follow municipal rules / नगर निगम नियमों का पालन करें</li>
            <li>Follow waste handling regulations / कचरा प्रबंधन नियमों का पालन करें</li>
            <li>Follow local authority guidelines / स्थानीय दिशा-निर्देशों का पालन करें</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">18. Data Privacy & Confidentiality / डेटा सुरक्षा</h3>
            <ul className="list-disc ml-5">
            <li>No sharing of customer data / ग्राहक डेटा साझा न करें</li>
            <li>No selling or misuse / डेटा बेचने या दुरुपयोग की अनुमति नहीं</li>
            <li>Violation → strict legal action / उल्लंघन पर सख्त कार्रवाई</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">19. Dispute & Legal Jurisdiction / विवाद एवं क्षेत्राधिकार</h3>
            <ul className="list-disc ml-5">
            <li>Governed by Indian laws / भारतीय कानून लागू होंगे</li>
            <li>Jurisdiction: Local court (Kanpur) / क्षेत्राधिकार: कानपुर न्यायालय</li>
            </ul>
        </section>

        <section>
            <h3 className="font-medium">20. Suspension & Blacklisting / निलंबन एवं प्रतिबंध</h3>
            <ul className="list-disc ml-5">
            <li>Company can suspend agent / कंपनी एजेंट को निलंबित कर सकती है</li>
            <li>Permanent blacklist for fraud / धोखाधड़ी पर स्थायी प्रतिबंध</li>
            </ul>
        </section>

        </div>

        {/* Final */}
        <section>
          <h2 className="font-semibold text-lg">
            Final Note / अंतिम संदेश
          </h2>
          <p className="italic">
            This system is built on trust, transparency, and professionalism. <br />
            यह प्रणाली विश्वास और पारदर्शिता पर आधारित है।
          </p>
        </section>

      </div>
      </div>
  )

}