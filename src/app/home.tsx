
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  getMe,
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} from "../services/api";

import { removeToken } from "../services/authStorage";

export default function HomeScreen() {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadHabits() {
      try {
        const data = await getHabits();

        console.log("HABITS :", data);

        setHabits(data);
      } catch (error) {
        console.log(
          "HABITS ERROR :",
          error instanceof Error
            ? error.message
            : String(error)
        );
      } finally {
        setLoading(false);
      }
    }

    loadHabits();
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getMe();

        console.log("CURRENT USER:", user);
      } catch (error) {
        console.log(
          "ME ERROR:",
          error instanceof Error
            ? error.message
            : String(error)
        );
      }
    }

    loadUser();
  }, []);

  const handleAddHabit = async () => {
    if (!newHabit.trim()) {
      Alert.alert("Error", "Please enter a habit");
      return;
    }

    try {
      setAdding(true);

      const habit = await createHabit(newHabit.trim());

      console.log("CREATED HABIT:", habit);

      setHabits((currentHabits) => [
        ...currentHabits,
        habit,
      ]);

      setNewHabit("");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to create habit"
      );
    } finally {
      setAdding(false);
    }
  };

  const handleToggleHabit = async (
    habitId: number,
    completed: boolean
  ) => {
    try {
      const updatedHabit = await updateHabit(
        habitId,
        completed
      );

      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit.id === habitId
            ? updatedHabit
            : habit
        )
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to update habit"
      );
    }
  };

  const handleDeleteHabit = async (habitId: number) => {
  try {
    await deleteHabit(habitId);

    setHabits((currentHabits) =>
      currentHabits.filter((habit) => habit.id !== habitId)
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    Alert.alert("Delete Failed", message);
  }
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      router.replace("/login");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to logout"
      );
    }
  };

  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length;



  const totalCount = habits.length;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Habitly</Text>

            <Text style={styles.title}>
              My Habits
            </Text>

            <Text style={styles.subtitle}>
              Build better habits every day
            </Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressLabel}>
              Today's progress
            </Text>

            <Text style={styles.progressCount}>
              {completedCount} / {totalCount}
            </Text>
          </View>

          <View style={styles.progressCircle}>
            <Text style={styles.progressPercentage}>
              {totalCount === 0
                ? "0%"
                : `${Math.round(
                  (completedCount / totalCount) * 100
                )}%`}
            </Text>
          </View>
        </View>

        {/* Add Habit */}
        <View style={styles.addCard}>
          <Text style={styles.sectionTitle}>
            Add a new habit
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Read for 20 minutes"
            placeholderTextColor="#9CA3AF"
            value={newHabit}
            onChangeText={setNewHabit}
            editable={!adding}
          />

          <TouchableOpacity
            style={[
              styles.addButton,
              adding && styles.disabledButton,
            ]}
            onPress={handleAddHabit}
            disabled={adding}
            activeOpacity={0.8}
          >
            {adding ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.addButtonText}>
                + Add Habit
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Habits */}
        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>
            Your habits
          </Text>

          {loading ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator
                size="large"
                color="#2563EB"
              />

              <Text style={styles.stateText}>
                Loading your habits...
              </Text>
            </View>
          ) : habits.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>
                🌱
              </Text>

              <Text style={styles.emptyTitle}>
                No habits yet
              </Text>

              <Text style={styles.emptyText}>
                Add your first habit and start
                building a better routine.
              </Text>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {habits.map((habit) => (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.habitCard,
                    habit.completed &&
                    styles.completedHabitCard,
                  ]}
                  onPress={() =>
                    handleToggleHabit(
                      habit.id,
                      !habit.completed
                    )
                  }
                  activeOpacity={0.75}
                >
                  <View
                    style={[
                      styles.checkbox,
                      habit.completed &&
                      styles.checkedBox,
                    ]}
                  >
                    {habit.completed && (
                      <Text style={styles.checkmark}>
                        ✓
                      </Text>
                    )}
                  </View>

                  <View style={styles.habitInfo}>
                    <Text
                      style={[
                        styles.habitName,
                        habit.completed &&
                        styles.completedHabitName,
                      ]}
                    >
                      {habit.name}
                    </Text>

                    <Text style={styles.habitStatus}>
                      {habit.completed
                        ? "Completed"
                        : "Tap to complete"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteHabit(habit.id)}
                    activeOpacity={0.7}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollView: {
    flex: 1,
  },

  container: {
    padding: 24,
    paddingTop: 55,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 24,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 18,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
  },

  progressCard: {
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  progressLabel: {
    color: "#DBEAFE",
    fontSize: 14,
    marginBottom: 6,
  },

  progressCount: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
  },

  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  progressPercentage: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },

  addCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
    marginBottom: 12,
  },

  addButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  habitsSection: {
    marginBottom: 24,
  },

  habitsList: {
    gap: 12,
  },

  habitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  completedHabitCard: {
    backgroundColor: "#EFF6FF",
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  checkedBox: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  checkmark: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  habitInfo: {
    flex: 1,
  },

  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  completedHabitName: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },

  habitStatus: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },

  stateContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  stateText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 12,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 38,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },

  logoutButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
});

