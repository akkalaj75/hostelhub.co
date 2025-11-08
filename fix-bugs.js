// fix-bugs.js — Add this as a separate file
let activeCallId = null;
let activeListeners = [];

// Track active call
function setActiveCall(id) {
  activeCallId = id;
}

// Cancel all old listeners
function clearAllListeners() {
  activeListeners.forEach(unsub => {
    if (typeof unsub === 'function') unsub();
  });
  activeListeners = [];
}

// Force delete waiting doc
async function forceDeleteWaiting(uid) {
  try {
    const ref = db.collection('waiting').doc(uid);
    const doc = await ref.get();
    if (doc.exists) await ref.delete();
  } catch (e) { console.warn('Cleanup warning:', e); }
}

// Reset video elements
function resetVideoStreams() {
  if (window.localStream) {
    window.localStream.getTracks().forEach(t => t.stop());
    window.localStream = null;
  }
  document.getElementById('local-video').srcObject = null;
  document.getElementById('remote-video').srcObject = null;
}

// Full cleanup on skip/end
async function fullCleanup() {
  clearAllListeners();
  if (window.pc) { window.pc.close(); window.pc = null; }
  resetVideoStreams();
  if (currentUser && activeCallId) {
    const callRef = db.collection('calls').doc(activeCallId);
    await callRef.collection('candidates').get().then(s => s.docs.forEach(d => d.ref.delete()));
    await callRef.collection('messages').get().then(s => s.docs.forEach(d => d.ref.delete()));
    await callRef.delete();
  }
  if (currentUser) await forceDeleteWaiting(currentUser.uid);
  activeCallId = null;
  showStatus('Ready', 'info');
  document.getElementById('findBtn').disabled = false;
}

// Export for use
window.bugFix = { setActiveCall, clearAllListeners, fullCleanup, forceDeleteWaiting };
