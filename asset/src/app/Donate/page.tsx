"use client";

import React, { useState, ChangeEvent, FormEvent } from "react"; // Added event types
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useColorMode } from "@/components/ui/color-mode";
import { Heart, AlertCircle, X } from "lucide-react";
import { useToast } from "@chakra-ui/react";
import Ai from "../Ai/pages";

import Footer from "../Footer/page";
import { useLanguageStore } from "../LanguageStore/languageStore";

// --- Translations remain unchanged ---
const translations = {
  title: {
    en: "Support Our Mission",
    am: "ተልእኮአችንን ይደግፉ",
    kor: "우리의 사명을 지원하세요",
    oro: "Qabsoo Keenya Tumsaa",
    chn: "支持我们的使命", // Added Chinese
  },
  subtitle: {
    en: "Your generous donations help us spread love and faith in our community.",
    am: "የእርስዎ ለጋስ መዋጮ በማህበረሰባችን ውስጥ ፍቅርና እምነትን ለመስፋፋት ይረዱናል።",
    kor: "여러분의 관대한 기부는 우리 커뮤니티에 사랑과 믿음을 전파하는 데 도움이 됩니다.",
    oro: "Keeffachiiftuun keessan gargaarsa qajeelaa fi amanamummaa hawaasa keenya keessatti babal’isuuf nu gargaara.",
    chn: "您慷慨的捐助有助于我们在社区中传播爱与信仰。", // Added Chinese
  },
  sectionTitle: {
    en: "How Your Donation Helps",
    am: "መዋጮዎ እንዴት እንደሚረዳ",
    kor: "당신의 기부가 어떻게 도움이 되는지",
    oro: "Keeffachiiftuun Kee Waan Haa Gargaaru",
    chn: "您的捐款如何提供帮助", // Added Chinese
  },
  sectionText: {
    en: "Every donation, big or small, goes directly to our community programs, outreach efforts, and support for those in need.",
    am: "እያንዳንዱ መዋጮ፣ ትልቅም ይሁን ትንሽ፣ በቀጥታ ወደ ማህበረሰብ ፕሮግራሞቻችን፣ የመልእክት ጥረቶች እና ለሚረዱት ድጋፍ ይሄዳል።",
    kor: "크든 작든 모든 기부는 커뮤니티 프로그램, 봉사 활동, 그리고 도움이 필요한 사람들을 위한 지원에 직접 사용됩니다。",
    oro: "Keeffachiiftuun hundi, guddaa ykn xiqqaa, sagantaa hawaasa keenya, yeroo gargaarsaa fi warra gargaarsa barbaachisuuf gargaarsa kennamuuf deemti.",
    chn: "每一笔捐款，无论大小，都将直接用于我们的社区项目、外展活动以及对有需要者的支持。", // Added Chinese
  },
  amount: {
    en: "Donation Amount",
    am: "የመዋጮ መጠን",
    kor: "기부 금액",
    oro: "Hamma Keeffachiiftuu",
    chn: "捐款金额", // Added Chinese
  },
  currency: {
    en: "Currency",
    am: "መገንዘብ",
    kor: "통화",
    oro: "Maallaqa",
    chn: "货币", // Added Chinese
  },
  customCurrency: {
    en: "Custom Currency",
    am: "ተጨማሪ መገንዘብ",
    kor: "사용자 지정 통화",
    oro: "Maallaqa Filatamaa",
    chn: "自定义货币", // Added Chinese
  },
  name: {
    en: "Your Name",
    am: "የእርስዎ ስም",
    kor: "당신의 이름",
    oro: "Maqaa Kee",
    chn: "您的姓名", // Added Chinese
  },
  email: {
    en: "Your Email",
    am: "የእርስዎ ኢሜል",
    kor: "당신의 이메일",
    oro: "Imeelii Kee",
    chn: "您的电子邮件", // Added Chinese
  },
  selectedPaymentId: {
    en: "Payment Method",
    am: "የመክፈያ ዘዴ",
    kor: "결제 방법",
    oro: "Adeemsa Kaffaltii",
    chn: "支付方式", // Added Chinese
  },
  bankDetails: {
    en: "Bank Details",
    am: "የባንክ ዝርዝሮች",
    kor: "은행 세부 정보",
    oro: "Ibsa Baankii",
    chn: "银行详情", // Added Chinese
  },
  transactionId: {
    en: "Transaction ID",
    am: "የግብይት መለያ",
    kor: "거래 ID",
    oro: "ID Galmee",
    chn: "交易ID", // Added Chinese
  },
  button: {
    en: "Submit Donation",
    am: "መዋጮ ያስገቡ",
    kor: "기부 제출",
    oro: "Keeffachiiftuu Galchaa",
    chn: "提交捐款", // Added Chinese
  },
  paymentOptions: {
    en: "Please transfer your donation to the selected bank account below and provide your Transaction ID for verification.",
    am: "እባክዎ መዋጮዎን ወደ ተመረጠው የባንክ አካውንት ያስተላልፉ እና ለማረጋገጫ የግብይት መለያዎን ያቅርቡ።",
    kor: "선택한 아래 은행 계좌로 기부를 송금하고 확인을 위해 거래 ID를 제공하세요.",
    oro: "Keeffachiiftuu keessan baankii filatame kana irratti galchadhaa fi ID Galmee keessan kennadhaa kan ragaa baasuuf.",
    chn: "请将您的捐款转账至下方选定的银行账户，并提供您的交易ID以供核实。", // Added Chinese
  },
  successMessageText: {
    en: "Donation submitted successfully! Thank you for your support!",
    am: "መዋጮ በተሳካ ሁኔታ ተጠናቋል! ለድጋፍዎ እናመሰግናለን!",
    kor: "기부가 성공적으로 제출되었습니다! 지원해 주셔서 감사합니다!",
    oro: "Keeffachiiftuun milkaa'inaan galchameera! Gargaarsa keessaniif galatoomaa!",
    chn: "捐款提交成功！感谢您的支持！", // Added Chinese
  },
  errorMessageText: {
    en: "Failed to submit donation. Please try again.",
    am: "መዋጮ ማስገባት አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
    kor: "기부 제출에 실패했습니다. 다시 시도해 주세요.",
    oro: "Keeffachiiftuu galchuu hin dandeenye. Maaloo irra deebi'aa yaali.",
    chn: "捐款提交失败。请重试。", // Added Chinese
  },
};

// --- Bank Accounts remain unchanged ---
const bankAccounts = {
  cbe: { name: "Global Ones Miss Ministry", account: "1000641044443" },
  awash: {
    name: "Global Onesmos Missionary Ministry",
    account: "013201399499600",
  },
  cbo: { name: "Global Onesmos Missionary Ministry", account: "1001900224591" },
  ob: { name: "Global Onesmos Missionary Ministry", account: "1741002400001" },
};
// -------------------------------------

export default function Donate() {
  const { colorMode } = useColorMode();
  const { selectedLanguage } = useLanguageStore();
  const lang = selectedLanguage?.value || "en";
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    donationAmount: "",
    currency: "USD",
    customCurrency: "",
    name: "",
    email: "",
    selectedPaymentId: "",
    transactionId: "",
  });
  // Type errors state with index signature
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    // ***** FIX: Add index signature type annotation *****
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.donationAmount || parseFloat(formData.donationAmount) <= 0)
      newErrors.donationAmount = "Valid amount is required";
    if (formData.currency === "Others" && !formData.customCurrency.trim())
      newErrors.customCurrency = "Custom currency is required";
    if (!formData.selectedPaymentId)
      newErrors.selectedPaymentId = "Payment method is required";
    if (!formData.transactionId.trim())
      newErrors.transactionId = "Transaction ID is required";
    setErrors(newErrors); // Assigning the typed object is now safe
    return Object.keys(newErrors).length === 0;
  };

  // Type annotation for 'e' already added
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Only Input elements in this form
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name]; // Directly use name as key
      return newErrors;
    });
    if (successMessage || errorMessage) {
      setSuccessMessage("");
      setErrorMessage("");
    }
  };

  // Type annotation for 'value' already added
  const handleSelectChange = (name: string, value: string) => {
    // Explicitly type params
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    if (successMessage || errorMessage) {
      setSuccessMessage("");
      setErrorMessage("");
    }
  };

  // Type annotation for 'e' already added
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage(""); // Clear messages at the start
    setErrorMessage("");

    try {
      const amount = parseFloat(formData.donationAmount);
      if (isNaN(amount) || amount <= 0) {
        // This case should ideally be caught by validation, but double-check
        throw new Error("Invalid donation amount");
      }

      const donationData = {
        email: formData.email,
        currency:
          formData.currency === "Others"
            ? formData.customCurrency
            : formData.currency,
        transactionId: formData.transactionId,
        // selectedTransactionId seems redundant if it's the same as transactionId
        // selectedTransactionId: formData.transactionId,
        name: formData.name,
        donationAmount: amount,
        // Include selected bank if needed by the API
        selectedBank: formData.selectedPaymentId
          ? bankAccounts[
              formData.selectedPaymentId as keyof typeof bankAccounts
            ].name
          : null,
      };

      const response = await fetch("/api/donation/donation", {
        // Ensure this API route exists
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        let errorData = {
          error: `Request failed: ${response.statusText || response.status}`,
        };
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.log(parseError);
          /* Ignore */
        }
        throw new Error(
          errorData.error || "Failed to submit donation to server"
        );
      }

      // Assuming the API returns useful data, though it's not used here
      // await response.json();

      // Use specific bank details in the toast message
      const selectedBankDetails =
        bankAccounts[formData.selectedPaymentId as keyof typeof bankAccounts];
      const successDesc = `Thank you! Please transfer ${formData.donationAmount} ${donationData.currency} to ${selectedBankDetails.name} (Account: ${selectedBankDetails.account}). We’ll verify Transaction ID: ${formData.transactionId} soon.`;

      toast({
        title: "Donation Info Received!", // Changed title slightly
        description: successDesc,
        status: "success",
        duration: 15000, // Longer duration to read details
        isClosable: true,
        position: "top-right",
      });

      setSuccessMessage(
        translations.successMessageText[
          lang as keyof typeof translations.successMessageText
        ] || translations.successMessageText.en
      );
      setFormData({
        // Reset form
        donationAmount: "",
        currency: "USD",
        customCurrency: "",
        name: "",
        email: "",
        selectedPaymentId: "",
        transactionId: "",
      });
      setErrors({}); // Clear errors on success
      // Remove setTimeout, message display is handled by AnimatePresence/state
      // setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error: unknown) {
      // Catch unknown
      const errorMsg =
        error instanceof Error
          ? error.message
          : translations.errorMessageText[
              lang as keyof typeof translations.errorMessageText
            ] || translations.errorMessageText.en;
      console.error("Submit error:", error);
      toast({
        title: "Submission Error",
        description: errorMsg,
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "top-right",
      });
      setErrorMessage(errorMsg); // Set error message state for display
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- The rest of the JSX remains completely unchanged ---
  return (
    <div
      className={`min-h-screen ${colorMode === "light" ? "bg-gray-100" : "bg-gray-900"} transition-colors duration-300`}
    >
      <Ai />
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl sm:text-5xl font-bold ${colorMode === "light" ? "text-gray-800" : "text-white"}`}
          >
            {translations.title[lang as keyof typeof translations.title]}
          </h1>
          <p
            className={`mt-4 text-lg ${colorMode === "light" ? "text-gray-600" : "text-gray-300"} max-w-2xl mx-auto`}
          >
            {translations.subtitle[lang as keyof typeof translations.subtitle]}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className={`rounded-2xl shadow-xl p-8 ${colorMode === "light" ? "bg-white" : "bg-gray-800"}`}
            >
              <h2
                className={`text-2xl font-semibold mb-6 ${colorMode === "light" ? "text-gray-800" : "text-white"}`}
              >
                {
                  translations.sectionTitle[
                    lang as keyof typeof translations.sectionTitle
                  ]
                }
              </h2>
              <p
                className={`mb-6 ${colorMode === "light" ? "text-gray-600" : "text-gray-300"}`}
              >
                {
                  translations.sectionText[
                    lang as keyof typeof translations.sectionText
                  ]
                }
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
                    >
                      {
                        translations.name[
                          lang as keyof typeof translations.name
                        ]
                      }{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={
                        translations.name[
                          lang as keyof typeof translations.name
                        ]
                      }
                      className={`mt-1 ${colorMode === "light" ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"} focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-required="true"
                      aria-invalid={errors.name ? "true" : "false"} // Safe access
                    />
                    {errors.name && ( // Safe access
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
                    >
                      {
                        translations.email[
                          lang as keyof typeof translations.email
                        ]
                      }{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={
                        translations.email[
                          lang as keyof typeof translations.email
                        ]
                      }
                      className={`mt-1 ${colorMode === "light" ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"} focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-required="true"
                      aria-invalid={errors.email ? "true" : "false"} // Safe access
                    />
                    {errors.email && ( // Safe access
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Donation Amount */}
                  <div>
                    <label
                      htmlFor="donationAmount"
                      className={`block text-sm font-medium ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
                    >
                      {
                        translations.amount[
                          lang as keyof typeof translations.amount
                        ]
                      }{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="donationAmount"
                      name="donationAmount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.donationAmount}
                      onChange={handleChange}
                      placeholder={
                        translations.amount[
                          lang as keyof typeof translations.amount
                        ]
                      }
                      className={`mt-1 ${colorMode === "light" ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"} focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-required="true"
                      aria-invalid={errors.donationAmount ? "true" : "false"} // Safe access
                    />
                    {errors.donationAmount && ( // Safe access
                      <p className="mt-1 text-sm text-red-500">
                        {errors.donationAmount}
                      </p>
                    )}
                  </div>

                  {/* Currency */}
                  <div>
                    <label
                      htmlFor="currency-trigger" // Label targets the trigger
                      className={`block text-sm font-medium ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
                    >
                      {
                        translations.currency[
                          lang as keyof typeof translations.currency
                        ]
                      }{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) =>
                        handleSelectChange("currency", value)
                      }
                    >
                      <SelectTrigger
                        id="currency-trigger" // ID for label
                        className={`mt-1 ${colorMode === "light" ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"} focus:ring-indigo-500 focus:border-indigo-500`}
                      >
                        <SelectValue
                          placeholder={
                            translations.currency[
                              lang as keyof typeof translations.currency
                            ]
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        className={
                          colorMode === "light" ? "bg-white" : "bg-gray-700"
                        }
                      >
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ETB">ETB</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Currency */}
                {formData.currency === "Others" && (
                  <div>
                    <label
                      htmlFor="customCurrency"
                      className={`block text-sm font-medium ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
                    >
                      {
                        translations.customCurrency[
                          lang as keyof typeof translations.customCurrency
                        ]
                      }{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="customCurrency"
                      name="customCurrency"
                      type="text"
                      value={formData.customCurrency}
                      onChange={handleChange}
                      placeholder="e.g., EUR"
                      className={`mt-1 ${colorMode === "light" ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"} focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-required="true"
                      aria-invalid={errors.customCurrency ? "true" : "false"} // Safe access
                    />
                    {errors.customCurrency && ( // Safe access
                      <p className="mt-1 text-sm text-red-500">
                        {errors.customCurrency}
                      </p>
                    )}
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label
                    htmlFor="selectedPaymentId-trigger" // Label targets the trigger
                    className={`block text-sm font-medium ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
                  >
                    {
                      translations.selectedPaymentId[
                        lang as keyof typeof translations.selectedPaymentId
                      ]
                    }{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.selectedPaymentId}
                    onValueChange={(value) =>
                      handleSelectChange("selectedPaymentId", value)
                    }
                  >
                    <SelectTrigger
                      id="selectedPaymentId-trigger" // ID for label
                      className={`mt-1 ${colorMode === "light" ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"} focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent
                      className={
                        colorMode === "light" ? "bg-white" : "bg-gray-700"
                      }
                    >
                      <SelectItem value="cbe">
                        Commercial Bank of Ethiopia (CBE)
                      </SelectItem>
                      <SelectItem value="awash">Awash Bank</SelectItem>
                      <SelectItem value="cbo">
                        Cooperative Bank of Oromia (CBO)
                      </SelectItem>
                      <SelectItem value="ob">Oromia Bank (OB)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.selectedPaymentId && ( // Safe access
                    <p className="mt-1 text-sm text-red-500">
                      {errors.selectedPaymentId}
                    </p>
                  )}
                </div>

                {/* Bank Details */}
                {formData.selectedPaymentId &&
                  bankAccounts[
                    formData.selectedPaymentId as keyof typeof bankAccounts
                  ] && ( // Check if selectedPaymentId is a valid key
                    <div
                      className={`p-4 rounded-lg border ${colorMode === "light" ? "border-gray-200" : "border-gray-600"}`}
                    >
                      <h3
                        className={`text-sm font-medium ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
                      >
                        {
                          translations.bankDetails[
                            lang as keyof typeof translations.bankDetails
                          ]
                        }
                      </h3>
                      <p
                        className={`text-sm ${colorMode === "light" ? "text-gray-900" : "text-gray-100"}`}
                      >
                        <strong>Name:</strong>{" "}
                        {
                          bankAccounts[
                            formData.selectedPaymentId as keyof typeof bankAccounts
                          ].name
                        }
                      </p>
                      <p
                        className={`text-sm ${colorMode === "light" ? "text-gray-900" : "text-gray-100"}`}
                      >
                        <strong>Account Number:</strong>{" "}
                        {
                          bankAccounts[
                            formData.selectedPaymentId as keyof typeof bankAccounts
                          ].account
                        }
                      </p>
                    </div>
                  )}

                {/* Transaction ID */}
                <div>
                  <label
                    htmlFor="transactionId"
                    className={`block text-sm font-medium ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
                  >
                    {
                      translations.transactionId[
                        lang as keyof typeof translations.transactionId
                      ]
                    }{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="transactionId"
                    name="transactionId"
                    type="text"
                    value={formData.transactionId}
                    onChange={handleChange}
                    placeholder={
                      translations.transactionId[
                        lang as keyof typeof translations.transactionId
                      ]
                    }
                    className={`mt-1 ${colorMode === "light" ? "bg-white border-gray-300" : "bg-gray-700 border-gray-600 text-white"} focus:ring-indigo-500 focus:border-indigo-500`}
                    aria-required="true"
                    aria-invalid={errors.transactionId ? "true" : "false"} // Safe access
                  />
                  {errors.transactionId && ( // Safe access
                    <p className="mt-1 text-sm text-red-500">
                      {errors.transactionId}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3 text-white ${colorMode === "light" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"} rounded-lg transition-colors duration-200 flex items-center justify-center`}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {isSubmitting
                    ? "Processing..."
                    : translations.button[
                        lang as keyof typeof translations.button
                      ]}
                </Button>
              </form>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {(successMessage || errorMessage) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`mt-6 p-4 rounded-lg flex items-center justify-between ${
                      successMessage
                        ? colorMode === "light"
                          ? "bg-green-100 text-green-800"
                          : "bg-green-900 text-green-200"
                        : colorMode === "light"
                          ? "bg-red-100 text-red-800"
                          : "bg-red-900 text-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span>{successMessage || errorMessage}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSuccessMessage("");
                        setErrorMessage("");
                      }}
                      className="focus:outline-none"
                      aria-label="Close alert"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Payment Options */}
              <div className="mt-8 text-center">
                <p
                  className={`text-lg ${colorMode === "light" ? "text-gray-600" : "text-gray-300"}`}
                >
                  {
                    translations.paymentOptions[
                      lang as keyof typeof translations.paymentOptions
                    ]
                  }
                </p>
                <p
                  className={`text-sm mt-2 ${colorMode === "light" ? "text-gray-500" : "text-gray-400"}`}
                >
                  Please allow 1-2 business days for verification of your
                  transaction.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div
              className={`rounded-2xl shadow-xl p-8 ${colorMode === "light" ? "bg-white" : "bg-gray-800"} h-full flex items-center justify-center text-center`}
            >
              <div>
                <Heart
                  className={`w-12 h-12 mx-auto mb-4 ${colorMode === "light" ? "text-indigo-600" : "text-indigo-400"}`}
                />
                <h2
                  className={`text-2xl font-semibold mb-4 ${colorMode === "light" ? "text-gray-800" : "text-white"}`}
                >
                  Make a Difference
                </h2>
                <p
                  className={`text-sm ${colorMode === "light" ? "text-gray-600" : "text-gray-300"}`}
                >
                  Your support empowers our mission to bring hope and
                  transformation to communities worldwide.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
