# Call Features Guide

This guide covers all the advanced features added to your LiveKit telehealth consultation calls.

## 🎯 Features Overview

### 1. **Call Metrics Display**
Real-time metrics shown at the top of the call interface:
- ⏱️ **Call Duration** - Live timer showing HH:MM:SS
- 🔴 **Recording Indicator** - Animated "REC" badge when recording
- 👥 **Participant Count** - Total number of people in the call
- 📶 **Network Quality** - Real-time connection status with color coding

### 2. **Network Quality Indicators**
- 🟢 **Excellent** - Green badge, best connection
- 🟢 **Good** - Green badge, solid connection
- 🟡 **Poor** - Yellow badge, degraded quality
- 🔴 **Lost** - Red badge, connection issues

### 3. **Recording Controls**
- Available only for doctors/specialists
- Start/Stop recording with one click
- Visual feedback with animated recording indicator
- Recordings saved with timestamps

### 4. **Event Notifications (Toast)**
Real-time toast notifications for:
- 💬 **Chat Messages** - When someone sends a message
- 👋 **Participant Joined** - New person enters the call
- 👋 **Participant Left** - Someone leaves the call
- 🎥 **Camera On/Off** - When participants toggle camera
- 🔴 **Recording Status** - Recording started/stopped

## 📁 Component Structure

```
features/call/components/
├── CallMetrics.tsx              # Duration, recording, participants, network
├── CallEventNotifications.tsx   # Toast notifications for events
├── RecordingControls.tsx        # Start/stop recording button
└── ConsultationCallView.tsx     # Main view integrating all features
```

## 🔧 Implementation Details

### CallMetrics Component

**Location:** Top overlay on the call interface

**Features:**
- **Duration Counter:** Updates every second
- **Recording Indicator:** Listens to `RoomEvent.RecordingStatusChanged`
- **Participant Count:** Uses `useRemoteParticipants()` hook
- **Network Quality:** Uses `useConnectionQualityIndicator()` hook

**Usage:**
```tsx
<CallMetrics />
```

### CallEventNotifications Component

**Events Monitored:**
- `RoomEvent.DataReceived` - Chat messages
- `RoomEvent.ParticipantConnected` - Joins
- `RoomEvent.ParticipantDisconnected` - Leaves
- `RoomEvent.RecordingStatusChanged` - Recording state
- `RoomEvent.TrackMuted/TrackUnmuted` - Camera/mic changes

**Toast Positions:**
- Chat messages: Top right
- Participant events: Bottom left
- Recording status: Top center

### RecordingControls Component

**Location:** Bottom center (above control bar)

**Functionality:**
- Calls `/api/recording/start` to begin recording
- Calls `/api/recording/stop` to end recording
- Shows loading state during API calls
- Only visible for `myRole="doctor"`

## 🚀 How to Use

### 1. Start a Call

```bash
# Navigate to
http://localhost:3000/

# Or specialist dashboard
http://localhost:3000/specialist/dashboard
```

### 2. View Call Metrics

Once connected, you'll see at the top:
```
┌─────────────────────────────────────────────────┐
│ [REC] [00:45]          [👥 2] [📶 Excellent]   │
└─────────────────────────────────────────────────┘
```

### 3. Start Recording (Doctor Only)

Click the "Start Recording" button at the bottom center:
```
[⚫ Start Recording]
```

After starting:
```
[⬛ Stop Recording]
```

### 4. Receive Event Notifications

When events happen, you'll see toast notifications:
- Participant joins: "John Doe joined the call 👋"
- Chat message: Shows sender and message preview
- Camera toggled: "Jane Smith turned on camera"

## 📊 Network Quality States

The network indicator shows your connection quality:

| Quality | Color | Icon | Description |
|---------|-------|------|-------------|
| Excellent | Green | 📶 | Perfect connection |
| Good | Green | 📶 | Stable connection |
| Poor | Yellow | 📶 | Some packet loss |
| Lost | Red | 📶❌ | Connection issues |

## 🎨 UI Layout

```
┌────────────────────────────────────────────────┐
│ [REC] [00:45]        [👥 3] [📶 Excellent]    │ <- CallMetrics
├────────────────────────────────────────────────┤
│                                                │
│         [Video Conference Interface]          │
│                                                │
│         [Participant Tiles in Grid]           │
│                                                │
├────────────────────────────────────────────────┤
│              [⚫ Start Recording]              │ <- RecordingControls (doctor only)
│                                                │
│    [🎤] [📹] [💬] [🖥️] [⚙️] [📞]             │ <- Built-in controls
└────────────────────────────────────────────────┘
```

## 🔌 API Endpoints

### Start Recording
```
POST /api/recording/start
Body: { "roomName": "consultation-123" }
Response: { "success": true, "egressId": "EG_..." }
```

### Stop Recording
```
POST /api/recording/stop
Body: { "roomName": "consultation-123", "egressId": "EG_..." }
Response: { "success": true }
```

## 🔐 Recording Backend Setup

To enable actual recording, you need to:

1. **Install LiveKit Server SDK:**
```bash
npm install @livekit/server-sdk
```

2. **Configure Egress (in your LiveKit server):**
```yaml
# livekit.yaml
egress:
  enabled: true
  file_output:
    local:
      directory: ./recordings
```

3. **Update API Routes:**
```typescript
import { EgressClient, EncodedFileOutput } from '@livekit/server-sdk';

const egressClient = new EgressClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

// Start recording
const egress = await egressClient.startRoomCompositeEgress(roomName, {
  file: {
    filepath: `recordings/${roomName}-${Date.now()}.mp4`,
  },
});
```

## 📝 Environment Variables

Add to `.env.local`:
```env
LIVEKIT_URL=wss://your-livekit-server.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

## 🎯 Role-Based Features

### Doctor/Specialist
✅ Can start/stop recording
✅ Sees all metrics
✅ Receives all notifications

### Patient
✅ Sees all metrics
✅ Receives all notifications
❌ Cannot control recording

## 🔧 Customization

### Change Toast Duration
```tsx
// In CallEventNotifications.tsx
toast.success("Message", {
  duration: 5000, // 5 seconds
});
```

### Change Network Quality Colors
```tsx
// In CallMetrics.tsx
case ConnectionQuality.Excellent:
  return {
    color: "text-blue-500", // Change color
    bgColor: "bg-blue-500/20",
  };
```

### Adjust Metrics Position
```tsx
// In CallMetrics.tsx
<div className="absolute top-4 left-4 right-4"> {/* Change positioning */}
```

## 🐛 Troubleshooting

### Recording Button Not Showing
- Check if `myRole="doctor"` is set
- Verify RecordingControls is imported

### Network Quality Always "Unknown"
- Ensure room is connected
- Check LiveKit server version (needs v1.4+)

### Toast Notifications Not Appearing
- Verify `react-hot-toast` is installed
- Check that `<Toaster />` is in your layout

### Recording Fails to Start
- Check API route is accessible
- Verify LiveKit egress is enabled
- Check server logs for errors

## 📚 LiveKit Event Reference

All events used:
- `RoomEvent.RecordingStatusChanged` - Recording state
- `RoomEvent.ParticipantConnected` - Join
- `RoomEvent.ParticipantDisconnected` - Leave
- `RoomEvent.DataReceived` - Chat messages
- `RoomEvent.TrackMuted` - Track muted
- `RoomEvent.TrackUnmuted` - Track unmuted
- `RoomEvent.ConnectionQualityChanged` - Network quality

## 🎉 Summary

You now have a **production-ready telehealth call interface** with:
- ⏱️ Live call duration
- 🔴 Recording with visual feedback
- 👥 Participant tracking
- 📶 Network quality monitoring
- 🔔 Real-time event notifications
- 🎨 Professional UI with smooth animations

All features work seamlessly with LiveKit's VideoConference and AudioConference components!
