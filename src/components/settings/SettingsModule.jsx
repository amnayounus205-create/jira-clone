import React, { useState } from "react";
import { Settings, Moon, Sun, Bell, Shield, Database, Save } from "lucide-react";

export default function SettingsModule() {
  const [settings, setSettings] = useState({
    workspaceName: "Jira Enterprise SaaS",
    workspaceKey: "JIRA",
    darkMode: false,
    emailNotifications: true,
    weeklyDigest: false,
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Workspace Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage workspace preferences, branding, and notification rules.</p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>Settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-200 pb-3">
            <Settings size={18} className="text-blue-600" /> General Workspace Info
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Workspace Name</label>
              <input
                type="text"
                value={settings.workspaceName}
                onChange={(e) => setSettings({ ...settings, workspaceName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Workspace Key</label>
              <input
                type="text"
                value={settings.workspaceKey}
                onChange={(e) => setSettings({ ...settings, workspaceKey: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm uppercase focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Theme Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-200 pb-3">
            <Sun size={18} className="text-blue-600" /> Appearance & Theme
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">Dark Mode Theme</p>
              <p className="text-xs text-slate-500">Enable dark color palette across all dashboard modules.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-200 pb-3">
            <Bell size={18} className="text-blue-600" /> Notification Preferences
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-semibold text-slate-800">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive alerts when assigned to new tasks or mentions.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Weekly Sprint Summary Digest</p>
                <p className="text-xs text-slate-500">Get a weekly report of completed velocity and burndown progress.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save size={18} /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}