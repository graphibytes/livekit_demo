# LiveKit Components Integration Guide

This project now uses **LiveKit's built-in prefab components** for rapid development instead of custom components.

## 🎯 Components Used

### 1. **VideoConference** (Video Calls)
- Full-featured video conferencing UI
- Grid view with pagination
- Focus layout for speaker view
- Built-in chat functionality
- Screen sharing support
- Participant controls

### 2. **AudioConference** (Audio/PSTN Calls)
- Audio-only conferencing UI
- Participant list view
- Audio controls
- Speaker indicators

### 3. **PreJoin** (Pre-call Setup)
- Device selection (camera/microphone)
- Live preview
- User name input
- Persistent user choices

## 📁 File Structure

```
app/
├── specialist/
│   └── dashboard/
│       └── page.tsx          # Specialist dashboard with call notifications
├── globals.css               # Includes LiveKit styles
└── page.tsx                  # Main entry point

features/call/
├── components/
│   ├── ConsultationCallView.tsx    # Simplified wrapper (VideoConference/AudioConference)
│   ├── consultationRoom.tsx        # LiveKitRoom wrapper
│   ├── PreJoinModal.tsx            # PreJoin component wrapper
│   ├── IncomingCallNotification.tsx # Call notification UI
│   ├── LoadingScreen.tsx           # Loading state
│   ├── ErrorScreen.tsx             # Error state
│   └── DeviceSelector.tsx          # (No longer needed with built-in PreJoin)
└── livekitview.tsx                 # Main view component
```

## 🚀 Usage

### Video Call
```tsx
<LiveKitRoom token={token} serverUrl={serverUrl}>
  <VideoConference />
</LiveKitRoom>
```

### Audio Call
```tsx
<LiveKitRoom token={token} serverUrl={serverUrl} video={false}>
  <AudioConference />
</LiveKitRoom>
```

### PreJoin (Before entering room)
```tsx
<PreJoin
  onSubmit={(userChoices) => {
    // Join room with userChoices.username, videoEnabled, audioEnabled
  }}
  defaults={{
    username: "",
    videoEnabled: true,
    audioEnabled: true,
  }}
/>
```

## 🎨 Call Types

The system supports three call types:

1. **Video Call** → Uses `VideoConference`
2. **Audio Call** → Uses `AudioConference`
3. **PSTN Call** → Uses `AudioConference` (phone audio converted to WebRTC)

## 🔄 Call Flow

### Specialist Side (Dashboard)
1. Dashboard loads at `/specialist/dashboard`
2. Incoming call notification appears (simulated after 3s)
3. Click "Accept" → PreJoin modal opens
4. Select devices, preview camera/mic
5. Click "Join Call" → Fetches token from backend
6. Enters LiveKitRoom with VideoConference/AudioConference
7. Click "Leave Call" → Returns to dashboard

### Current Test Route
- Visit `/` or `/LivekitConsultationRoom` to test direct call entry
- Uses your existing token flow from `http://localhost:7880/api/token`

## 📦 What Was Removed

The following custom components were replaced with LiveKit built-ins:
- Custom video/audio controls
- Custom participant tiles
- Custom device selectors
- Custom grid layouts
- Custom focus layouts

## ✅ Benefits

✓ **Less code to maintain** - LiveKit handles complex UI logic
✓ **Production-ready** - Battle-tested components
✓ **Consistent UX** - Follows video conferencing best practices
✓ **Built-in features** - Chat, screen share, layouts included
✓ **Responsive** - Mobile and desktop optimized
✓ **Accessible** - ARIA labels and keyboard navigation

## 🎨 Customization

### Theme
The `data-lk-theme="default"` attribute on `LiveKitRoom` can be changed to customize colors.

### Chat Formatting
```tsx
<VideoConference
  chatMessageFormatter={(msg) => {
    // Custom message formatting
    return formattedMessage;
  }}
/>
```

### Settings Component
```tsx
<VideoConference
  SettingsComponent={YourCustomSettings}
/>
```

## 🔧 Environment Variables

Make sure you have:
```env
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
```

## 📚 Documentation

- [LiveKit React Components](https://docs.livekit.io/reference/components/react/)
- [VideoConference API](https://docs.livekit.io/reference/components/react/)
- [PreJoin API](https://docs.livekit.io/reference/components/react/)

## 🧪 Testing

1. Start LiveKit server:
```bash
cd server
npm run dev
```

2. Start Next.js:
```bash
npm run dev
```

3. Test routes:
   - `/specialist/dashboard` - Full specialist experience
   - `/` - Direct call entry (existing flow)

## 🚀 Next Steps

1. Connect real WebSocket/SSE for incoming calls
2. Implement backend call routing
3. Add PSTN/SIP integration
4. Implement call recording
5. Add analytics and monitoring
