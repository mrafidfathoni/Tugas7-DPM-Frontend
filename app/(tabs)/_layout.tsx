import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    // Custom colors and styles inspired by Boboiboy Galaxy
    const boboiboyColors = {
        light: {
            tint: '#FF5722', // Orange color representing Boboiboy's core theme
            background: '#FFE0B2', // Lighter orange
        },
        dark: {
            tint: '#FF9800', // Darker orange for dark mode
            background: '#3E2723', // Space-inspired dark brown
        },
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: boboiboyColors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                        backgroundColor: boboiboyColors[colorScheme ?? 'light'].background,
                    },
                    default: {
                        backgroundColor: boboiboyColors[colorScheme ?? 'light'].background,
                    },
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Mission', // Represents Boboiboy's missions
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="planet" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Team', // Represents the Galaxy team
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="team" color={color}/>,
                }}
            />
        </Tabs>
    );
}
