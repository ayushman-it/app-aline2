import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";

import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";

const friends = [
  { id: "1", name: "Rahul" },
  { id: "2", name: "Aman" },
  { id: "3", name: "Rohit" },
  { id: "4", name: "Priya" },
];

const filters = [
  { name: "Normal", overlay: null },
  { name: "Warm", overlay: "rgba(255,150,0,0.2)" },
  { name: "Cool", overlay: "rgba(0,150,255,0.2)" },
  { name: "Vintage", overlay: "rgba(120,80,40,0.3)" },
];

const CreatePostScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [music, setMusic] = useState("");

  const [text, setText] = useState("");
  const [showText, setShowText] = useState(false);

  const [taggedUsers, setTaggedUsers] = useState<any[]>([]);

  const pickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 5,
    });

    if (result.assets) {
      setImages(result.assets);
    }
  };

  const toggleTag = (user: any) => {
    if (taggedUsers.find((u) => u.id === user.id)) {
      setTaggedUsers(taggedUsers.filter((u) => u.id !== user.id));
    } else {
      setTaggedUsers([...taggedUsers, user]);
    }
  };

  const renderImage = () => {
    if (images.length === 0) {
      return <Text style={{ color: "#999" }}>Select Image</Text>;
    }

    const uri = images[0].uri;

    return (
      <View style={{ width: "100%", height: "100%" }}>
        <Image source={{ uri }} style={styles.image} />

        {selectedFilter.overlay && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: selectedFilter.overlay,
            }}
          />
        )}
      </View>
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const data = {
        images,
        filter: selectedFilter.name,
        caption,
        location,
        music,
        text,
        taggedUsers,
      };

      console.log("POST DATA", data);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} />
        </TouchableOpacity>

        <Text style={styles.title}>New Post</Text>

        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.next}>{step === 4 ? "POST" : "Next"}</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGE PREVIEW */}

      <View style={styles.preview}>
        {renderImage()}

        {showText && <Text style={styles.overlayText}>{text}</Text>}
      </View>

      {/* STEP 1 */}

      {step === 1 && (
        <View style={styles.center}>
          <TouchableOpacity style={styles.btn} onPress={pickImages}>
            <Text style={{ color: "#fff" }}>Select Images</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2 FILTERS */}

      {step === 2 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => setSelectedFilter(item)}
            >
              <View style={{ width: 70, height: 70 }}>
                {images[0] && (
                  <Image
                    source={{ uri: images[0].uri }}
                    style={styles.filterImage}
                  />
                )}

                {item.overlay && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: item.overlay,
                    }}
                  />
                )}
              </View>

              <Text
                style={{
                  marginTop: 5,
                  fontWeight:
                    selectedFilter.name === item.name ? "bold" : "normal",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* STEP 3 TEXT + MUSIC */}

      {step === 3 && (
        <View style={styles.tools}>
          <TextInput
            placeholder="Enter Text"
            value={text}
            onChangeText={setText}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.smallBtn}
            onPress={() => setShowText(true)}
          >
            <Text>Add Text</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Music Name"
            value={music}
            onChangeText={setMusic}
            style={styles.input}
          />
        </View>
      )}

      {/* STEP 4 */}

      {step === 4 && (
        <View style={{ padding: 20 }}>
          <TextInput
            placeholder="Write Caption"
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
          />

          <TextInput
            placeholder="Add Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />

          <Text style={{ marginTop: 20, fontWeight: "bold" }}>
            Tag Friends
          </Text>

          {friends.map((user) => {
            const selected = taggedUsers.find((u) => u.id === user.id);

            return (
              <TouchableOpacity
                key={user.id}
                style={styles.friend}
                onPress={() => toggleTag(user)}
              >
                <Text>{user.name}</Text>
                <Text>{selected ? "✓" : ""}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  title: { fontSize: 18, fontWeight: "bold" },

  next: { color: "#1877f2", fontSize: 16 },

  preview: {
    height: 350,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  center: { alignItems: "center", padding: 30 },

  btn: { backgroundColor: "#000", padding: 15, borderRadius: 10 },

  filterItem: {
    margin: 10,
    alignItems: "center",
  },

  filterImage: {
    width: "100%",
    height: "100%",
  },

  tools: { padding: 20 },

  input: {
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 20,
  },

  smallBtn: {
    backgroundColor: "#eee",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  overlayText: {
    position: "absolute",
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  friend: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});