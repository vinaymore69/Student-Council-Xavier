import React, { useState, useEffect } from "react";
import { Mail, Clock, CheckCircle, XCircle, Calendar, Users, Paperclip } from "lucide-react";

const EmailHistory = ({ history }) => {
  const [filter, setFilter] = useState('all');

  const filteredHistory = history.filter(email => {
    if (filter === 'all') return true;
    return email.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      sent: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700',
      pending: 'bg-gray-100 text-gray-700',
      partial: 'bg-orange-100 text-orange-700'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-gray-50" id="history">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">03</span>
            <span>Email History</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {['all', 'sent', 'scheduled', 'pending', 'failed', 'partial'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-6 py-3 rounded-full font-medium transition-all duration-300
                  ${filter === status 
                    ? 'bg-pulse-500 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((email, index) => (
                <div
                  key={email.id || index}
                  className="bg-white rounded-2xl shadow-elegant p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-pulse-50 rounded-xl">
                        {getStatusIcon(email.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-display font-semibold mb-1">{email.subject}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{email.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(email.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-pulse-500" />
                      <span>{email.recipients.length} Recipients</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-pulse-500" />
                      <span>{email.scheduledAt || email.sentAt || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-pulse-500" />
                      <span>By: {email.sentBy}</span>
                    </div>
                  </div>

                  {/* Attachment Display - FIXED */}
                  {email.attachment && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Paperclip className="w-4 h-4 text-pulse-500" />
                        <span>
                          Attachment: {
                            typeof email.attachment === 'string' 
                              ? email.attachment 
                              : email.attachment.name || 'Unknown file'
                          }
                        </span>
                        {typeof email.attachment === 'object' && email.attachment.size && (
                          <span className="text-xs text-gray-500">
                            ({(email.attachment.size / 1024).toFixed(2)} KB)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-elegant">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">No Emails Found</h3>
                <p className="text-gray-600">No emails match the selected filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailHistory;