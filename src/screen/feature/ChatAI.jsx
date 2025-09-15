import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getData, postData } from "../../api/service";
import { ArrowLeft, Send, Loader2 } from "lucide-react-native";

const ChatScreen = ({ navigation }) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const flatListRef = useRef(null);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const fetchChats = useCallback(async () => {
    try {
      const res = await getData("Chat/getChatCS");
      if (res.code === 200) {
        setChats(res.data);
      }
    } catch (err) {
      console.log("Error fetching chat:", err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const newMessage = {
      id: Date.now(),
      sender: "User",
      message,
      status: "sending",
    };

    setChats((prev) => [...prev, newMessage]);
    setMessage("");
    setIsSending(true);

    try {
      const body = { message, image: "" };
      const res = await postData("Chat/sendChatCS", body);

      setChats((prev) =>
        prev.map((c) =>
          c.id === newMessage.id
            ? { ...c, status: "sent", ...(res.data || {}) }
            : c
        )
      );
    } catch (err) {
      console.log("Error sending message:", err);
      setChats((prev) =>
        prev.map((c) =>
          c.id === newMessage.id ? { ...c, status: "failed" } : c
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.chatBubble,
        item.sender === "User" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={item.sender === "User" ? styles.userText : styles.botText}>
        {item.message}
      </Text>
      {item.sender === "User" && (
        <View style={styles.statusIcon}>
          {item.status === "sending" && <Loader2 size={14} color="white" />}
          {item.status === "sent" && <Text style={{ color: "white" }}>✓</Text>}
          {item.status === "failed" && <Text style={{ color: "red" }}>✗</Text>}
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      {/* Chat List */}
      <View style={styles.chatContainer}>
        {initialLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={chats}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Ketik pesan..."
          onSubmitEditing={handleSend}
          editable={!isSending}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || isSending) && { backgroundColor: "gray" },
          ]}
          onPress={handleSend}
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <Loader2 size={20} color="white" />
          ) : (
            <Send size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { marginLeft: 12, fontSize: 18, fontWeight: "bold", color: "#000" },
  chatContainer: { flex: 1, backgroundColor: "white" },
  chatBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    position: "relative",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
    borderBottomRightRadius: 0,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e7eb",
    borderBottomLeftRadius: 0,
  },
  userText: { color: "white" },
  botText: { color: "#111" },
  statusIcon: {
    position: "absolute",
    right: 6,
    bottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatScreen;
