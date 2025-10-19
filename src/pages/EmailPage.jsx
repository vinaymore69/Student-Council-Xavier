import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmailHero from '@/components/EmailHero';
import RecipientSelector from '@/components/RecipientSelector';
import EmailComposer from '@/components/EmailComposer';
import EmailHistory from '@/components/EmailHistory';
import { EMAIL_CONFIG } from '@/config/emailConfig';
import { TEMP_EMAIL_HISTORY } from '@/data/tempEmailData';
import { toast } from 'sonner';

const EmailPage = () => {
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [scheduledEmails, setScheduledEmails] = useState([]);

  useEffect(() => {
    emailjs.init(EMAIL_CONFIG.publicKey);
    console.log('✅ EmailJS initialized');
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('emailHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setEmailHistory([...parsed, ...TEMP_EMAIL_HISTORY]);
    } else {
      setEmailHistory(TEMP_EMAIL_HISTORY);
    }

    // Load scheduled emails
    const savedScheduled = localStorage.getItem('scheduledEmails');
    if (savedScheduled) {
      setScheduledEmails(JSON.parse(savedScheduled));
    }
  }, []);

  // Check for scheduled emails every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkScheduledEmails();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [scheduledEmails]);

  const saveToHistory = (emailData) => {
  const newEntry = {
    ...emailData,
    id: Date.now(),
    // Convert attachment object to string for display
    attachment: emailData.attachment 
      ? (typeof emailData.attachment === 'string' 
          ? emailData.attachment 
          : emailData.attachment.name)
      : null
  };
  const newHistory = [newEntry, ...emailHistory];
  setEmailHistory(newHistory);
  
  const userEmails = newHistory.filter(email => email.id >= 1000000000000);
  localStorage.setItem('emailHistory', JSON.stringify(userEmails));
};

  const checkScheduledEmails = async () => {
    const now = new Date();
    const toSend = scheduledEmails.filter(email => {
      const scheduledTime = new Date(email.scheduledAt);
      return scheduledTime <= now;
    });

    for (const email of toSend) {
      await sendEmailNow(email);
      // Remove from scheduled
      const remaining = scheduledEmails.filter(e => e.id !== email.id);
      setScheduledEmails(remaining);
      localStorage.setItem('scheduledEmails', JSON.stringify(remaining));
    }
  };

  const sendEmailNow = async (emailData) => {
    let successCount = 0;
    let failCount = 0;

    for (const recipient of emailData.recipients) {
      try {
        // Prepare message with attachment link
        let messageContent = emailData.description;
        
        if (emailData.attachment) {
          messageContent += `\n\n---\n📎 Attachment: ${emailData.attachment.name}\n[File is attached as base64 - Download functionality requires backend server]`;
        }

        const templateParams = {
          to_email: recipient.email,
          to_name: recipient.name,
          subject: emailData.subject,
          message: messageContent,
          from_name: 'Admin - vinaymore69'
        };

        console.log('📤 Sending to:', recipient.email);

        const response = await emailjs.send(
          EMAIL_CONFIG.serviceId,
          EMAIL_CONFIG.templateId,
          templateParams
        );

        console.log('✅ Success:', response.status);
        successCount++;
        toast.success(`✅ Sent to ${recipient.name}`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (error) {
        console.error('❌ Failed to send to:', recipient.email);
        failCount++;
        toast.error(`❌ Failed: ${recipient.name}`);
      }
    }

    return { successCount, failCount };
  };

  const handleSendEmail = async (emailData) => {
    try {
      const isScheduled = emailData.scheduledAt !== null;

      if (isScheduled) {
        // Add to scheduled emails
        const scheduledEmail = {
          ...emailData,
          id: Date.now(),
          status: 'scheduled',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        const newScheduled = [...scheduledEmails, scheduledEmail];
        setScheduledEmails(newScheduled);
        localStorage.setItem('scheduledEmails', JSON.stringify(newScheduled));
        
        saveToHistory(scheduledEmail);
        toast.success(`📅 Email scheduled for ${emailData.scheduledAt}`);
        setSelectedRecipients([]);
        return;
      }

      toast.info(`📧 Sending email to ${emailData.recipients.length} recipient(s)...`);
      
      const { successCount, failCount } = await sendEmailNow(emailData);

      // Save to history
      const sentEmail = {
        ...emailData,
        status: successCount > 0 ? (failCount > 0 ? 'partial' : 'sent') : 'failed',
        sentAt: successCount > 0 ? new Date().toISOString().replace('T', ' ').substring(0, 19) : null,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      saveToHistory(sentEmail);

      // Final notification
      if (successCount > 0 && failCount === 0) {
        toast.success(`🎉 All emails sent successfully! (${successCount}/${emailData.recipients.length})`);
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(`⚠️ Partially sent: ${successCount} succeeded, ${failCount} failed`);
      } else {
        toast.error(`❌ All emails failed to send`);
      }
      
      setSelectedRecipients([]);

    } catch (error) {
      console.error('💥 Critical error:', error);
      
      const failedEmail = {
        ...emailData,
        status: 'failed',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      saveToHistory(failedEmail);

      toast.error('❌ Failed to send: ' + (error.text || error.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="space-y-0">
        <EmailHero />
        <RecipientSelector 
          selectedRecipients={selectedRecipients}
          setSelectedRecipients={setSelectedRecipients}
        />
        <EmailComposer 
          selectedRecipients={selectedRecipients}
          onSendEmail={handleSendEmail}
        />
        <EmailHistory history={emailHistory} />
      </main>
      
      <Footer />
    </div>
  );
};

export default EmailPage;