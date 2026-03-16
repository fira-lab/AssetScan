"use client";

// Add specific event types to the React import
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useColorMode } from "@/components/ui/color-mode";

import Footer from "../Footer/page";

import {
  AlertCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useToast } from "@chakra-ui/react";
import { useLanguageStore } from "../LanguageStore/languageStore";

// --- Translations and CONTACT_INFO remain unchanged ---
const translations = {
  title: {
    en: "Get in Touch",
    am: "ግንኙነት ያድርጉ",
    kor: "문의하기",
    oro: "Nu Qunnamaa",
    chn: "联系我们",
  },
  subtitle: {
    en: "We’d love to hear from you! Fill out the form or reach out directly.",
    am: "ከእርስዎ መስማት እንወዳለን! ቅጹን ይሙሉ ወይም በቀጥታ ያግኙን።",
    kor: "여러분의 의견을 듣고 싶습니다! 양식을 작성하거나 직접 연락주세요.",
    oro: "Isin irraa dhaga'uu ni jaallanna! Unka guutaa ykn nu qunnamaa.",
    chn: "我们很乐意听到您的声音！请填写表格或直接与我们联系。",
  },
  nameLabel: { en: "Name", am: "ስም", kor: "이름", oro: "Maqaa", chn: "姓名" },
  namePlaceholder: {
    en: "Your Name",
    am: "የእርስዎ ስም",
    kor: "이름을 입력하세요",
    oro: "Maqaa Keessan",
    chn: "您的姓名",
  },
  emailLabel: {
    en: "Email",
    am: "ኢሜይል",
    kor: "이메일",
    oro: "Imeelii",
    chn: "电子邮件",
  },
  emailPlaceholder: {
    en: "Your Email",
    am: "የእርስዎ ኢሜይል",
    kor: "이메일을 입력하세요",
    oro: "Imeelii Keessan",
    chn: "您的电子邮件",
  },
  phoneLabel: {
    en: "Phone Number",
    am: "ስልክ ቁጥር",
    kor: "전화번호",
    oro: "Lakkorofsa Bilbilaa",
    chn: "电话号码",
  },
  phonePlaceholder: {
    en: "Your Phone Number",
    am: "የእርስዎ ስልክ ቁጥር",
    kor: "전화번호를 입력하세요",
    oro: "Lakkorofsa Bilbila Keessanii",
    chn: "您的电话号码",
  },
  countryLabel: {
    en: "Country",
    am: "ሀገር",
    kor: "국가",
    oro: "Biyya",
    chn: "国家",
  },
  countryPlaceholder: {
    en: "Your Country",
    am: "የእርስዎ ሀገር",
    kor: "국가를 입력하세요",
    oro: "Biyya Keessan",
    chn: "您的国家",
  },
  locationLabel: {
    en: "Location",
    am: "ቦታ",
    kor: "위치",
    oro: "Bakka",
    chn: "地点",
  },
  locationPlaceholder: {
    en: "Select your location",
    am: "ቦታዎን ይምረጡ",
    kor: "위치를 선택하세요",
    oro: "Bakka keessan filadhaa",
    chn: "选择您的地点",
  },
  locationUSA: { en: "USA", am: "አሜሪካ", kor: "미국", oro: "USA", chn: "美国" },
  locationEthiopia: {
    en: "Ethiopia",
    am: "ኢትዮጵያ",
    kor: "에티오피아",
    oro: "Itoophiyaa",
    chn: "埃塞俄比亚",
  },
  locationOther: {
    en: "Other",
    am: "ሌላ",
    kor: "기타",
    oro: "Kan biraa",
    chn: "其他",
  },
  messageLabel: {
    en: "Message",
    am: "መልዕክት",
    kor: "메시지",
    oro: "Ergaa",
    chn: "留言",
  },
  messagePlaceholder: {
    en: "Your Message",
    am: "የእርስዎ መልዕክት",
    kor: "메시지를 입력하세요",
    oro: "Ergaa Keessan",
    chn: "您的留言",
  },
  subscribeCheckbox: {
    en: "Subscribe to our newsletter",
    am: "ለዜና መጽሄታችን ይመዝገቡ",
    kor: "뉴스레터 구독",
    oro: "Odeeffannoo keenyaaf galmaa'i",
    chn: "订阅我们的新闻通讯",
  },
  sendButton: {
    en: "Send Message",
    am: "መልዕክት ላክ",
    kor: "메시지 보내기",
    oro: "Ergaa Ergi",
    chn: "发送信息",
  },
  successMessageText: {
    en: "Message sent successfully!",
    am: "መልዕክቱ በተሳካ ሁኔታ ተልኳል!",
    kor: "메시지가 성공적으로 전송되었습니다!",
    oro: "Ergaan milkaa'inaan ergameera!",
    chn: "信息发送成功！",
  },
  errorMessageText: {
    en: "Failed to send message. Please try again.",
    am: "መልዕክት መላክ አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
    kor: "메시지 전송에 실패했습니다. 다시 시도해 주세요.",
    oro: "Ergaa ergachuu hin dandeenye. Maaloo irra deebi'aa yaali.",
    chn: "信息发送失败。请重试。",
  },
  moreWaysTitle: {
    en: "Connect With Us",
    am: "ከእኛ ጋር ይገናኙ",
    kor: "우리와 연결하기",
    oro: "Nu waliin walqabsiisaa",
    chn: "联系我们",
  },
  emailInfo: {
    en: "Email",
    am: "ኢሜይል",
    kor: "이메일",
    oro: "Imeelii",
    chn: "电子邮件",
  },
  phoneInfo: {
    en: "Phone",
    am: "ስልክ",
    kor: "전화",
    oro: "Bilbila",
    chn: "电话",
  },
  locationInfo: {
    en: "Location",
    am: "ቦታ",
    kor: "위치",
    oro: "Bakka",
    chn: "地点",
  },
};
const CONTACT_INFO = {
  email: "info@g-omm.com",
  phone: "+251912091671",
  location: "Addis Ababa, Ethiopia",
  social: {
    facebook:
      "https://web.facebook.com/p/Global-Onesmos-Missionary-MinistryG-OMM-100069484219049/?locale=en_GB&_rdc=1&_rdr#",

    instagram: "https://www.instagram.com/gomm01099/",
    linkedin:
      "https://www.linkedin.com/company/global-onesmos-missionary-movement/about/?viewAsMember=true",
  },
};
// -----------------------------------------------------

export default function Contact() {
  const { colorMode } = useColorMode();
  const { selectedLanguage } = useLanguageStore();
  const lang = selectedLanguage?.value || "en";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    location: "",
    message: "",
    subscribe: false,
  });
  // ***** FIX: Use an index signature for the errors state object *****
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (successMessage || errorMessage) {
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [formData, successMessage, errorMessage]);

  // Type annotation for 'e' already added
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof typeof newErrors];
      return newErrors;
    });
  };

  // Type annotation for 'e' already added
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, subscribe: e.target.checked }));
  };

  // Type annotation for 'value' already added
  const handleLocationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, location: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors["location" as keyof typeof newErrors];
      return newErrors;
    });
  };

  // validateForm logic remains unchanged
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors); // Now type-safe because errors expects {[key: string]: string}
    return Object.keys(newErrors).length === 0;
  };

  // Type annotation for 'e' already added
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        let errorData = {
          error: `Request failed with status ${response.status}`,
        };
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.log(parseError);
          /* Ignore */
        }
        throw new Error(errorData.error || "Failed to send message");
      }
      setSuccessMessage(
        translations.successMessageText[
          lang as keyof typeof translations.successMessageText
        ] || translations.successMessageText.en
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        location: "",
        message: "",
        subscribe: false,
      });
      setErrors({});
      toast({
        title: "Successfully sent!",
        description: "We will get back to you soon!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : translations.errorMessageText[
              lang as keyof typeof translations.errorMessageText
            ] || translations.errorMessageText.en;
      console.error("Form submission error:", error);
      toast({
        title: "Failed to send message!",
        description: errorMsg,
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "top-right",
      });
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- The rest of the JSX remains completely unchanged ---
  // (No changes needed in the return statement)
  return (
    <div
      className={`min-h-screen ${
        colorMode === "light" ? "bg-gray-100" : "bg-gray-900"
      } transition-colors duration-300`}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");
        body {
          font-family: "Inter", sans-serif;
        }
      `}</style>
      
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl sm:text-5xl font-bold ${
              colorMode === "light" ? "text-gray-800" : "text-white"
            }`}
          >
            {translations.title[lang as keyof typeof translations.title]}
          </h1>
          <p
            className={`mt-4 text-lg ${
              colorMode === "light" ? "text-gray-600" : "text-gray-300"
            } max-w-2xl mx-auto`}
          >
            {translations.subtitle[lang as keyof typeof translations.subtitle]}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className={`rounded-2xl shadow-xl p-8 ${
                colorMode === "light" ? "bg-white" : "bg-gray-800"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium ${
                        colorMode === "light"
                          ? "text-gray-700"
                          : "text-gray-200"
                      }`}
                    >
                      {
                        translations.nameLabel[
                          lang as keyof typeof translations.nameLabel
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
                        translations.namePlaceholder[
                          lang as keyof typeof translations.namePlaceholder
                        ]
                      }
                      className={`mt-1 ${
                        colorMode === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-700 border-gray-600 text-white"
                      } focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-required="true"
                      // Accessing errors.name is now safe due to the index signature
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                    {/* Accessing errors.name is now safe */}
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium ${
                        colorMode === "light"
                          ? "text-gray-700"
                          : "text-gray-200"
                      }`}
                    >
                      {
                        translations.emailLabel[
                          lang as keyof typeof translations.emailLabel
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
                        translations.emailPlaceholder[
                          lang as keyof typeof translations.emailPlaceholder
                        ]
                      }
                      className={`mt-1 ${
                        colorMode === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-700 border-gray-600 text-white"
                      } focus:ring-indigo-500 focus:border-indigo-500`}
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
                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className={`block text-sm font-medium ${
                        colorMode === "light"
                          ? "text-gray-700"
                          : "text-gray-200"
                      }`}
                    >
                      {
                        translations.phoneLabel[
                          lang as keyof typeof translations.phoneLabel
                        ]
                      }
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={
                        translations.phonePlaceholder[
                          lang as keyof typeof translations.phonePlaceholder
                        ]
                      }
                      className={`mt-1 ${
                        colorMode === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-700 border-gray-600 text-white"
                      } focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label
                      htmlFor="country"
                      className={`block text-sm font-medium ${
                        colorMode === "light"
                          ? "text-gray-700"
                          : "text-gray-200"
                      }`}
                    >
                      {
                        translations.countryLabel[
                          lang as keyof typeof translations.countryLabel
                        ]
                      }{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder={
                        translations.countryPlaceholder[
                          lang as keyof typeof translations.countryPlaceholder
                        ]
                      }
                      className={`mt-1 ${
                        colorMode === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-700 border-gray-600 text-white"
                      } focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-required="true"
                      aria-invalid={errors.country ? "true" : "false"} // Safe access
                    />
                    {errors.country && ( // Safe access
                      <p className="mt-1 text-sm text-red-500">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location-trigger"
                    className={`block text-sm font-medium ${
                      colorMode === "light" ? "text-gray-700" : "text-gray-200"
                    }`}
                  >
                    {
                      translations.locationLabel[
                        lang as keyof typeof translations.locationLabel
                      ]
                    }
                  </label>
                  <Select
                    value={formData.location}
                    onValueChange={handleLocationChange}
                  >
                    <SelectTrigger
                      id="location-trigger"
                      className={`mt-1 ${
                        colorMode === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-700 border-gray-600 text-white"
                      } focus:ring-indigo-500 focus:border-indigo-500`}
                      aria-label={
                        translations.locationPlaceholder[
                          lang as keyof typeof translations.locationPlaceholder
                        ]
                      }
                    >
                      <SelectValue
                        placeholder={
                          translations.locationPlaceholder[
                            lang as keyof typeof translations.locationPlaceholder
                          ]
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className={
                        colorMode === "light" ? "bg-white" : "bg-gray-700"
                      }
                    >
                      <SelectItem value="usa">
                        {
                          translations.locationUSA[
                            lang as keyof typeof translations.locationUSA
                          ]
                        }
                      </SelectItem>
                      <SelectItem value="ethiopia">
                        {
                          translations.locationEthiopia[
                            lang as keyof typeof translations.locationEthiopia
                          ]
                        }
                      </SelectItem>
                      <SelectItem value="other">
                        {
                          translations.locationOther[
                            lang as keyof typeof translations.locationOther
                          ]
                        }
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium ${
                      colorMode === "light" ? "text-gray-700" : "text-gray-200"
                    }`}
                  >
                    {
                      translations.messageLabel[
                        lang as keyof typeof translations.messageLabel
                      ]
                    }{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={
                      translations.messagePlaceholder[
                        lang as keyof typeof translations.messagePlaceholder
                      ]
                    }
                    rows={5}
                    className={`mt-1 ${
                      colorMode === "light"
                        ? "bg-white border-gray-300"
                        : "bg-gray-700 border-gray-600 text-white"
                    } focus:ring-indigo-500 focus:border-indigo-500`}
                    aria-required="true"
                    aria-invalid={errors.message ? "true" : "false"} // Safe access
                  />
                  {errors.message && ( // Safe access
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Subscribe Checkbox */}
                <div className="flex items-center">
                  <input
                    id="subscribe"
                    name="subscribe"
                    type="checkbox"
                    checked={formData.subscribe}
                    onChange={handleCheckboxChange}
                    className={`h-4 w-4 ${
                      colorMode === "light"
                        ? "text-indigo-600 border-gray-300"
                        : "text-indigo-500 border-gray-600"
                    } focus:ring-indigo-500 rounded`}
                  />
                  <label
                    htmlFor="subscribe"
                    className={`ml-2 text-sm ${
                      colorMode === "light" ? "text-gray-700" : "text-gray-200"
                    }`}
                  >
                    {
                      translations.subscribeCheckbox[
                        lang as keyof typeof translations.subscribeCheckbox
                      ]
                    }
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3 text-white ${
                    colorMode === "light"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  } rounded-lg transition-colors duration-200`}
                >
                  {isSubmitting
                    ? "Sending..."
                    : translations.sendButton[
                        lang as keyof typeof translations.sendButton
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
            </div>
          </motion.div>

          {/* Contact Info & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div
              className={`rounded-2xl shadow-xl p-8 ${
                colorMode === "light" ? "bg-white" : "bg-gray-800"
              } h-full`}
            >
              <h2
                className={`text-2xl font-semibold mb-6 ${
                  colorMode === "light" ? "text-gray-800" : "text-white"
                }`}
              >
                {
                  translations.moreWaysTitle[
                    lang as keyof typeof translations.moreWaysTitle
                  ]
                }
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail
                    className={`w-5 h-5 mr-3 ${
                      colorMode === "light"
                        ? "text-indigo-600"
                        : "text-indigo-400"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        colorMode === "light"
                          ? "text-gray-700"
                          : "text-gray-200"
                      }`}
                    >
                      {
                        translations.emailInfo[
                          lang as keyof typeof translations.emailInfo
                        ]
                      }
                    </p>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className={`text-sm hover:underline ${
                        colorMode === "light"
                          ? "text-gray-900"
                          : "text-gray-100"
                      }`}
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone
                    className={`w-5 h-5 mr-3 ${
                      colorMode === "light"
                        ? "text-indigo-600"
                        : "text-indigo-400"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        colorMode === "light"
                          ? "text-gray-700"
                          : "text-gray-200"
                      }`}
                    >
                      {
                        translations.phoneInfo[
                          lang as keyof typeof translations.phoneInfo
                        ]
                      }
                    </p>
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className={`text-sm hover:underline ${
                        colorMode === "light"
                          ? "text-gray-900"
                          : "text-gray-100"
                      }`}
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin
                    className={`w-5 h-5 mr-3 ${
                      colorMode === "light"
                        ? "text-indigo-600"
                        : "text-indigo-400"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        colorMode === "light"
                          ? "text-gray-700"
                          : "text-gray-200"
                      }`}
                    >
                      {
                        translations.locationInfo[
                          lang as keyof typeof translations.locationInfo
                        ]
                      }
                    </p>
                    <p
                      className={`text-sm ${
                        colorMode === "light"
                          ? "text-gray-900"
                          : "text-gray-100"
                      }`}
                    >
                      {CONTACT_INFO.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3
                  className={`text-lg font-medium mb-4 ${
                    colorMode === "light" ? "text-gray-800" : "text-white"
                  }`}
                >
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href={CONTACT_INFO.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full ${
                      colorMode === "light"
                        ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        : "bg-indigo-900 text-indigo-400 hover:bg-indigo-800"
                    } transition-colors duration-200`}
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  <a
                    href={CONTACT_INFO.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full ${
                      colorMode === "light"
                        ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        : "bg-indigo-900 text-indigo-400 hover:bg-indigo-800"
                    } transition-colors duration-200`}
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={CONTACT_INFO.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full ${
                      colorMode === "light"
                        ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        : "bg-indigo-900 text-indigo-400 hover:bg-indigo-800"
                    } transition-colors duration-200`}
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
