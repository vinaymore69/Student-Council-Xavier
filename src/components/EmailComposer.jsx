import React, { useState } from "react";
import { Paperclip, Calendar, Send, Clock, X } from "lucide-react";
import { toast } from "sonner";

const EmailComposer = ({ selectedRecipients, onSendEmail }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentBase64, setAttachmentBase64] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size should be less than 10MB");
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(file);
        setAttachmentBase64(reader.result);
        toast.success(`File "${file.name}" attached successfully`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentBase64(null);
    toast.info("Attachment removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    if (!subject || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isScheduled && (!scheduleDate || !scheduleTime)) {
      toast.error("Please set schedule date and time");
      return;
    }

    setIsSending(true);

    const emailData = {
      subject,
      description,
      attachment: attachment ? {
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        base64: attachmentBase64
      } : null,
      recipients: selectedRecipients,
      scheduledAt: isScheduled ? `${scheduleDate} ${scheduleTime}` : null,
      sentBy: 'vinaymore69'
    };

    await onSendEmail(emailData);
    
    // Reset form
    setSubject('');
    setDescription('');
    setAttachment(null);
    setAttachmentBase64(null);
    setScheduleDate('');
    setScheduleTime('');
    setIsScheduled(false);
    setIsSending(false);
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-white" id="compose">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">02</span>
            <span>Compose Email</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant bg-white">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-pulse-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-pulse-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your message here..."
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment (Will be included as link)
                  </label>
                  {attachment ? (
                    <div className="flex items-center gap-3 p-4 bg-pulse-50 rounded-xl">
                      <Paperclip className="w-5 h-5 text-pulse-500" />
                      <div className="flex-1">
                        <span className="text-sm text-gray-700 font-medium">{attachment.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(attachment.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pulse-500 hover:bg-pulse-50/30 transition-all duration-300">
                      <Paperclip className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Click to attach file (Max 10MB)</span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                      />
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Note: Attachment will be converted to a downloadable link in the email
                  </p>
                </div>

                {/* Schedule Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="schedule"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="w-5 h-5 text-pulse-500 rounded focus:ring-pulse-500"
                  />
                  <label htmlFor="schedule" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Schedule for later
                  </label>
                </div>

                {/* Schedule Date & Time */}
                {isScheduled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date <span className="text-pulse-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500"
                        required={isScheduled}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time <span className="text-pulse-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500"
                        required={isScheduled}
                      />
                    </div>
                  </div>
                )}

                {/* Recipients Summary */}
                {selectedRecipients.length > 0 && (
                  <div className="p-4 bg-pulse-50 rounded-xl">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Recipients:</span> {selectedRecipients.length} selected
                      {selectedRecipients.length <= 5 && (
                        <span className="ml-2">
                          ({selectedRecipients.map(r => r.name).join(', ')})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSending || selectedRecipients.length === 0}
                  className="w-full px-8 py-4 bg-pulse-500 hover:bg-pulse-600 text-white font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      {isScheduled ? <Calendar className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                      {isScheduled ? 'Schedule Email' : 'Send Now'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailComposer;