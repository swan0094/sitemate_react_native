import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface Article {
  url: string;
  title: string;
  description: string;
}

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [url, setUrl] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const setSearchQueryHandler = (value: React.SetStateAction<string>) => {
    setSearchQuery(value);
    setUrl(
      `https://newsapi.org/v2/everything?q=${value}&sortBy=popularity&apiKey=183daca270264bad86fc5b72972fb82a`
    );
  };

  const searchNews = async () => {
    setIsLoading(true);
    setShowResults(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.status === 200) {
        setSearchResults(data.articles);
      } else {
        console.log("Failed to load news");
      }
    } catch (error) {
      console.log("Error fetching news:", error);
    }
    setIsLoading(false);
  };

  const goBack = () => {
    setShowResults(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        {showResults && (
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Sitemate - Alex Swan App</Text>
      </View>
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : !showResults ? (
          <View style={styles.searchContainer}>
            <Text style={styles.welcomeText}>Welcome to my demo app!</Text>
            <Text style={styles.instructionsText}>
              Type a keyword and hit enter or click the search icon to search
              for related news.
            </Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              onChangeText={setSearchQueryHandler}
              onSubmitEditing={searchNews}
            />
            <Button title="Search" onPress={searchNews} />
          </View>
        ) : searchResults.length === 0 ? (
          <Text style={styles.noResultsText}>No results</Text>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>{item.title}</Text>
                <Text style={styles.listItemDescription}>
                  {item.description}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e81da",
    padding: 16,
  },
  backButton: {
    color: "white",
    marginRight: 16,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
  },
  searchContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    textAlign: "center",
  },
  instructionsText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  searchBar: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listItemDescription: {
    fontSize: 14,
  },
});

export default App;
