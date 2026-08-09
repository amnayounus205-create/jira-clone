import React, { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  Send,
  Pencil,
  Trash2,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Eye,
  Download,
  AtSign,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const STORAGE_KEY = "jira_comments_attachments";

const defaultUsers = [
  {
    id: "u1",
    name: "Ayesha Khan",
    initials: "AK",
  },
  {
    id: "u2",
    name: "Daniel Ross",
    initials: "DR",
  },
  {
    id: "u3",
    name: "Mei Lin",
    initials: "ML",
  },
  {
    id: "u4",
    name: "Omar Farouk",
    initials: "OF",
  },
  {
    id: "u5",
    name: "Daniel Noor",
    initials: "DN",
  },
  {
    id: "u6",
    name: "John Williams",
    initials: "JW",
  },
];

const readStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {};
    }

    return JSON.parse(saved);
  } catch {
    return {};
  }
};

const saveStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore localStorage errors
  }
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getInitials = (name) => {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function CommentsPanel({
  issueId = "default-issue",
  currentUser = {
    id: "current-user",
    name: "Ayesha Khan",
    initials: "AK",
  },
  users = defaultUsers,
}) {
  const fileInputRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [attachments, setAttachments] = useState([]);

  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionList, setShowMentionList] = useState(false);

  const [previewFile, setPreviewFile] = useState(null);

  // ============================================================
  // LOAD SAVED DATA
  // ============================================================

  useEffect(() => {
    const stored = readStorage();

    const issueData = stored[issueId];

    if (!issueData) {
      setComments([]);
      setAttachments([]);
      return;
    }

    setComments(issueData.comments || []);
    setAttachments(issueData.attachments || []);
  }, [issueId]);

  // ============================================================
  // SAVE DATA
  // ============================================================

  useEffect(() => {
    const stored = readStorage();

    stored[issueId] = {
      comments,
      attachments,
    };

    saveStorage(stored);
  }, [issueId, comments, attachments]);

  // ============================================================
  // ADD COMMENT
  // ============================================================

  const handleAddComment = (e) => {
    e.preventDefault();

    const text = commentText.trim();

    if (!text) {
      toast.error("Write a comment first");
      return;
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      text,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        initials:
          currentUser.initials ||
          getInitials(currentUser.name),
      },
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    setComments((prev) => [newComment, ...prev]);

    setCommentText("");

    setShowMentionList(false);

    toast.success("Comment added");
  };

  // ============================================================
  // EDIT COMMENT
  // ============================================================

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditingText(comment.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEditedComment = (commentId) => {
    const text = editingText.trim();

    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              text,
              updatedAt: new Date().toISOString(),
            }
          : comment
      )
    );

    setEditingId(null);
    setEditingText("");

    toast.success("Comment updated");
  };

  // ============================================================
  // DELETE COMMENT
  // ============================================================

  const deleteComment = (commentId) => {
    setComments((prev) =>
      prev.filter((comment) => comment.id !== commentId)
    );

    toast.success("Comment deleted");
  };

  // ============================================================
  // MENTIONS
  // ============================================================

  const handleCommentChange = (e) => {
    const value = e.target.value;

    setCommentText(value);

    const match = value.match(/@([a-zA-Z0-9_]*)$/);

    if (match) {
      setMentionQuery(match[1].toLowerCase());
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
      setMentionQuery("");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(mentionQuery)
  );

  const insertMention = (user) => {
    const mention = `@${user.name} `;

    const match = commentText.match(/@([a-zA-Z0-9_]*)$/);

    if (!match) {
      setCommentText((prev) => `${prev}${mention}`);
    } else {
      const startIndex =
        commentText.length - match[0].length;

      setCommentText(
        `${commentText.slice(0, startIndex)}${mention}`
      );
    }

    setShowMentionList(false);
    setMentionQuery("");
  };

  // ============================================================
  // FILE UPLOAD
  // ============================================================

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];

    const maxSize = 10 * 1024 * 1024;

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `${file.name}: Only images and PDF files are allowed`
        );
        return;
      }

      if (file.size > maxSize) {
        toast.error(
          `${file.name}: Maximum file size is 10 MB`
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const newAttachment = {
          id: `attachment-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
          uploadedAt: new Date().toISOString(),
        };

        setAttachments((prev) => [
          newAttachment,
          ...prev,
        ]);

        toast.success(`${file.name} uploaded`);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // ============================================================
  // DELETE ATTACHMENT
  // ============================================================

  const deleteAttachment = (attachmentId) => {
    setAttachments((prev) =>
      prev.filter(
        (attachment) =>
          attachment.id !== attachmentId
      )
    );

    if (
      previewFile &&
      previewFile.id === attachmentId
    ) {
      setPreviewFile(null);
    }

    toast.success("Attachment deleted");
  };

  // ============================================================
  // DOWNLOAD ATTACHMENT
  // ============================================================

  const downloadAttachment = (attachment) => {
    const link = document.createElement("a");

    link.href = attachment.data;
    link.download = attachment.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Comments
              </h3>

              <p className="text-[11px] text-slate-400">
                Discuss this issue with your team
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {comments.length}{" "}
            {comments.length === 1
              ? "comment"
              : "comments"}
          </span>
        </div>

        {/* ======================================================
            COMMENT LIST
        ====================================================== */}

        <div className="p-5">

          {comments.length === 0 ? (
            <div className="py-10 text-center">

              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <MessageSquare size={22} />
              </div>

              <p className="text-sm font-semibold text-slate-700">
                No comments yet
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Start a conversation with your team.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {comments.map((comment) => {

                const isEditing =
                  editingId === comment.id;

                return (
                  <div
                    key={comment.id}
                    className="group border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition"
                  >

                    {/* Comment Header */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                          {comment.author.initials}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {comment.author.name}
                          </p>

                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(
                              comment.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {comment.author.id ===
                        currentUser.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">

                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                comment
                              )
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit comment"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteComment(
                                comment.id
                              )
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete comment"
                          >
                            <Trash2 size={14} />
                          </button>

                        </div>
                      )}
                    </div>

                    {/* Comment Content */}

                    {isEditing ? (
                      <div className="mt-3 space-y-2">

                        <textarea
                          value={editingText}
                          onChange={(e) =>
                            setEditingText(
                              e.target.value
                            )
                          }
                          rows={3}
                          autoFocus
                          className="w-full px-3 py-2.5 border border-blue-300 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                        />

                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              saveEditedComment(
                                comment.id
                              )
                            }
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Check size={13} />
                            Save
                          </button>

                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {comment.text}
                      </p>
                    )}

                  </div>
                );
              })}
            </div>
          )}

          {/* ====================================================
              ATTACHMENTS
          ==================================================== */}

          <div className="mt-6 pt-5 border-t border-slate-200">

            <div className="flex items-center justify-between mb-3">

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Attachments
                </h4>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Images and PDF files
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Paperclip size={14} />
                Add attachment
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,application/pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {attachments.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center">

                <Paperclip
                  size={20}
                  className="mx-auto text-slate-300"
                />

                <p className="text-xs font-semibold text-slate-500 mt-2">
                  No attachments
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  Upload images or PDF files up to 10 MB.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {attachments.map((attachment) => {

                  const isImage =
                    attachment.type.startsWith(
                      "image/"
                    );

                  return (
                    <div
                      key={attachment.id}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 group"
                    >

                      {/* Preview */}

                      {isImage ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewFile(
                              attachment
                            )
                          }
                          className="w-full h-32 bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                          <img
                            src={attachment.data}
                            alt={attachment.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewFile(
                              attachment
                            )
                          }
                          className="w-full h-32 bg-red-50 flex flex-col items-center justify-center cursor-pointer hover:bg-red-100 transition"
                        >
                          <FileText
                            size={32}
                            className="text-red-500"
                          />

                          <span className="text-[10px] font-bold text-red-600 mt-2 uppercase">
                            PDF
                          </span>
                        </button>
                      )}

                      {/* File Info */}

                      <div className="p-3">

                        <div className="flex items-start gap-2">

                          {isImage ? (
                            <ImageIcon
                              size={15}
                              className="text-blue-500 mt-0.5 shrink-0"
                            />
                          ) : (
                            <FileText
                              size={15}
                              className="text-red-500 mt-0.5 shrink-0"
                            />
                          )}

                          <div className="min-w-0 flex-1">

                            <p
                              className="text-xs font-semibold text-slate-700 truncate"
                              title={
                                attachment.name
                              }
                            >
                              {attachment.name}
                            </p>

                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {formatFileSize(
                                attachment.size
                              )}
                            </p>

                          </div>
                        </div>

                        {/* Actions */}

                        <div className="flex items-center gap-2 mt-3">

                          <button
                            type="button"
                            onClick={() =>
                              setPreviewFile(
                                attachment
                              )
                            }
                            className="flex-1 px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center justify-center gap-1"
                          >
                            <Eye size={13} />
                            Preview
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              downloadAttachment(
                                attachment
                              )
                            }
                            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 text-slate-500 hover:text-blue-600"
                            title="Download"
                          >
                            <Download
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteAttachment(
                                attachment.id
                              )
                            }
                            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-600"
                            title="Delete attachment"
                          >
                            <Trash2
                              size={14}
                            />
                          </button>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ====================================================
              ADD COMMENT
          ==================================================== */}

          <div className="mt-6 pt-5 border-t border-slate-200">

            <form
              onSubmit={handleAddComment}
              className="relative"
            >

              <textarea
                value={commentText}
                onChange={handleCommentChange}
                placeholder="Write a comment... Use @ to mention someone"
                rows={3}
                className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              />

              {/* Mention Icon */}

              <div className="absolute right-3 top-3">

                <AtSign
                  size={16}
                  className="text-slate-400"
                />
              </div>

              {/* Mention Dropdown */}

              {showMentionList &&
                filteredUsers.length > 0 && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20">

                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Mention someone
                      </p>
                    </div>

                    {filteredUsers.map(
                      (user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() =>
                            insertMention(user)
                          }
                          className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-blue-50 text-left"
                        >
                          <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold">
                            {user.initials}
                          </span>

                          <span className="text-xs font-semibold text-slate-700">
                            {user.name}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}

              <div className="flex items-center justify-between mt-2">

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1.5"
                >
                  <Paperclip size={14} />
                  Attach file
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Send size={14} />
                  Add comment
                </button>

              </div>
            </form>

            <p className="text-[10px] text-slate-400 mt-2">
              Supported: JPG, PNG, GIF, WEBP and PDF · Maximum
              file size: 10 MB
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          FILE PREVIEW MODAL
      ======================================================== */}

      {previewFile && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >

          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Preview Header */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">

              <div className="flex items-center gap-3 min-w-0">

                {previewFile.type.startsWith(
                  "image/"
                ) ? (
                  <ImageIcon
                    size={18}
                    className="text-blue-600 shrink-0"
                  />
                ) : (
                  <FileText
                    size={18}
                    className="text-red-600 shrink-0"
                  />
                )}

                <div className="min-w-0">

                  <p className="text-sm font-bold text-slate-800 truncate">
                    {previewFile.name}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {formatFileSize(
                      previewFile.size
                    )}
                  </p>

                </div>
              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    downloadAttachment(
                      previewFile
                    )
                  }
                  className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  title="Download"
                >
                  <Download size={18} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewFile(null)
                  }
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>

              </div>
            </div>

            {/* Preview Body */}

            <div className="flex-1 overflow-auto bg-slate-100 min-h-[400px] flex items-center justify-center p-4">

              {previewFile.type.startsWith(
                "image/"
              ) ? (
                <img
                  src={previewFile.data}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              ) : (
                <iframe
                  src={previewFile.data}
                  title={previewFile.name}
                  className="w-full h-[70vh] rounded-lg bg-white border border-slate-200"
                />
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
