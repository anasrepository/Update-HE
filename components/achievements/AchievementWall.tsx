import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { AchievementDBModal } from '@/utils/dbFunctions';
import { Achievement } from '@/utils/table.types';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 6) / 2;

const getIconName = (achievement: any) => {
  const type = achievement?.type || achievement?.category || '';

  switch (type) {
    case 'workout':
    case 'fitness':
      return 'barbell';
    case 'meal':
    case 'nutrition':
      return 'restaurant';
    case 'goal':
      return 'flag';
    case 'streak':
    case 'consistency':
      return 'calendar';
    case 'weight':
    case 'milestone':
      return 'trophy';
    default:
      return 'star';
  }
};

const getGradientColors = (achievement: any) => {
  const completed = achievement?.completed || achievement?.is_completed || achievement?.achieved;
  const type = achievement?.type || achievement?.category || '';

  if (!completed) {
    return ['#454545', '#2D2D2D'];
  }

  switch (type) {
    case 'workout':
    case 'fitness':
      return ['#F8A353', '#E97F4E'];
    case 'meal':
    case 'nutrition':
      return ['#6ABD6E', '#45A048'];
    case 'streak':
    case 'consistency':
      return ['#5EADF5', '#3B92E3'];
    case 'goal':
    case 'weight':
    case 'milestone':
      return ['#B470C8', '#9559B6'];
    default:
      return ['#E97F4E', '#D67443'];
  }
};

const getPatternOpacity = (achievement: any) => {
  const completed = achievement?.completed || achievement?.is_completed || achievement?.achieved;
  return completed ? 0.08 : 0.03;
};

const AchievementWall = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const fetchedAchievements = await AchievementDBModal.get();

        console.log('Fetched Achievements:', fetchedAchievements);

        if (Array.isArray(fetchedAchievements)) {
          setAchievements(fetchedAchievements);
        } else {
          setAchievements([]);
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setAchievements([]);
      }
    };

    loadAchievements();
  }, []);

  const completedCount = achievements.filter(
    (a: any) => a?.completed || a?.is_completed || a?.achieved
  ).length;

  const totalAchievements = achievements.length;

  const completionPercentage =
    totalAchievements > 0
      ? Math.round((completedCount / totalAchievements) * 100)
      : 0;

  const totalAcorns = achievements
    .filter((a: any) => a?.completed || a?.is_completed || a?.achieved)
    .reduce((sum: number, item: any) => {
      return sum + Number(item?.xp || item?.required_count || 0);
    }, 0);

  const showAchievementDetails = (achievement: any) => {
    setSelectedAchievement(achievement);
    setDetailsVisible(true);
  };

  const closeDetails = () => {
    setDetailsVisible(false);
    setSelectedAchievement(null);
  };

  const getAchievementTitle = (achievement: any) => {
    return achievement?.title || achievement?.name || 'Unnamed Achievement';
  };

  const getAchievementDescription = (achievement: any) => {
    return achievement?.description || 'No description available';
  };

  const getAchievementXP = (achievement: any) => {
    return Number(achievement?.xp || achievement?.required_count || 0);
  };

  const isCompleted = (achievement: any) => {
    return achievement?.completed || achievement?.is_completed || achievement?.achieved;
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${completionPercentage}%` },
              ]}
            />
          </View>

          <Text style={styles.progressText}>{completionPercentage}%</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalAchievements}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {totalAchievements === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="trophy-outline" size={60} color="#D68D54" />
          <Text style={styles.emptyTitle}>No Achievements Found</Text>
          <Text style={styles.emptySubtitle}>
            Achievements will appear here after they are added in the database.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.achievementGrid}>
            {achievements.map((achievement: any, index: number) => {
              const title = getAchievementTitle(achievement);
              const description = getAchievementDescription(achievement);
              const xp = getAchievementXP(achievement);
              const completed = isCompleted(achievement);

              return (
                <TouchableOpacity
                  key={
                    achievement?.achievement_id
                      ? achievement.achievement_id.toString()
                      : index.toString()
                  }
                  style={styles.achievementItem}
                  activeOpacity={0.75}
                  onPress={() => showAchievementDetails(achievement)}
                >
                  <View style={styles.achievementCardContainer}>
                    <LinearGradient
                      colors={getGradientColors(achievement)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.achievementCard}
                    >
                      <View
                        style={[
                          styles.patternOverlay,
                          { opacity: getPatternOpacity(achievement) },
                        ]}
                      />

                      <View style={styles.iconContainer}>
                        <Ionicons
                          name={getIconName(achievement) as any}
                          size={28}
                          color="#FFFFFF"
                        />
                      </View>

                      <View style={styles.textContainer}>
                        <Text style={styles.achievementTitle} numberOfLines={1}>
                          {title}
                        </Text>

                        <Text style={styles.achievementDescription} numberOfLines={1}>
                          {description}
                        </Text>
                      </View>

                      <View style={styles.acornBadge}>
                        <Text style={styles.acornBadgeText}>
                          {xp} Acorns
                        </Text>
                      </View>

                      {!completed && (
                        <BlurView intensity={15} style={styles.lockedOverlay}>
                          <View style={styles.lockIconContainer}>
                            <Ionicons name="lock-closed" size={22} color="#FFFFFF" />
                          </View>
                        </BlurView>
                      )}
                    </LinearGradient>

                    <View style={styles.cardShadow} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {selectedAchievement && detailsVisible && (
        <Animated.View style={styles.detailsModal}>
          <BlurView intensity={40} style={styles.blurOverlay}>
            <TouchableOpacity style={styles.closeButton} onPress={closeDetails}>
              <Ionicons name="close-circle" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.detailsCard}>
              <LinearGradient
                colors={getGradientColors(selectedAchievement)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.detailsCardGradient}
              >
                <View style={styles.detailsIconContainer}>
                  <Ionicons
                    name={getIconName(selectedAchievement) as any}
                    size={48}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.detailsTitle}>
                  {getAchievementTitle(selectedAchievement)}
                </Text>

                <Text style={styles.detailsDescription}>
                  {getAchievementDescription(selectedAchievement)}
                </Text>

                {isCompleted(selectedAchievement) ? (
                  <View style={styles.completedInfo}>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.completedInfoText}>
                      Completed
                    </Text>
                  </View>
                ) : (
                  <View style={styles.lockedInfo}>
                    <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
                    <Text style={styles.lockedInfoText}>
                      Complete the task to unlock
                    </Text>
                  </View>
                )}

                <View style={styles.detailsAcornContainer}>
                  <Text style={styles.detailsAcornText}>
                    {getAchievementXP(selectedAchievement)} Acorns
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A2A1F',
  },

  statLabel: {
    fontSize: 12,
    color: '#9B8579',
    marginTop: 4,
  },

  progressContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },

  progressBarBackground: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(214, 141, 84, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#D68D54',
  },

  progressText: {
    fontSize: 12,
    color: '#9B8579',
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },

  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  achievementItem: {
    width: CARD_WIDTH,
    marginBottom: 20,
    height: 140,
    marginHorizontal: CARD_MARGIN / 2,
  },

  achievementCardContainer: {
    flex: 1,
    position: 'relative',
  },

  achievementCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 1,
  },

  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: -1,
  },

  cardShadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 18,
    zIndex: -1,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  textContainer: {
    alignItems: 'center',
    width: '100%',
  },

  achievementTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  achievementDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginTop: 3,
  },

  acornBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  acornBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },

  lockIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#9B8579',
    textAlign: 'center',
    lineHeight: 22,
  },

  detailsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1001,
  },

  detailsCard: {
    width: '80%',
    aspectRatio: 0.7,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  detailsCardGradient: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailsIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },

  detailsDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },

  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },

  completedInfoText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },

  lockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },

  lockedInfoText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },

  detailsAcornContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  detailsAcornText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AchievementWall;