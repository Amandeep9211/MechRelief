import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '../constants/theme';
import { useApp } from '../state/AppState';
import { money } from '../utils/format';
import { Page, Button, Card, Row, Divider, Avatar, Stars, Input, Pill } from '../components/ui';

const TAGS = ['On time', 'Professional', 'Fair price', 'Clean work', 'Polite', 'Explained the work'];
const WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// Job ke baad rating aur review (proposal: har job rating ke saath khatam hoti hai).
export default function Rate() {
  const router = useRouter();
  const { job, finishJob } = useApp();
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState(['On time']);
  const [review, setReview] = useState('');

  if (!job) {
    return (
      <Page>
        <Text style={{ color: colors.muted, marginTop: 60, textAlign: 'center' }}>Nothing to rate.</Text>
        <Button title="Go Home" onPress={() => router.replace('/(tabs)')} style={{ marginTop: 20 }} />
      </Page>
    );
  }

  const toggle = (t) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const submit = () => {
    const hadReport = job.categoryId === 'inspection';
    finishJob({ rating, review: [tags.join(', '), review].filter(Boolean).join(' | ') });
    router.replace(hadReport ? '/inspection-report' : '/(tabs)/bookings');
  };

  return (
    <Page footer={<Button title="Submit Review" icon="send-outline" onPress={submit} />}>
      <View style={s.hero}>
        <View style={s.tick}><Icon name="check" size={40} color="#fff" /></View>
        <Text style={s.title}>Job Completed</Text>
        <Text style={s.sub}>Payment confirmed by both sides. Thanks for using MechRelief.</Text>
      </View>

      <Card>
        <Row label="Service" value={job.title} />
        <Row label="Total paid" value={money(job.price.total)} bold />
        <Divider />
        <View style={s.worker}>
          <Avatar name={job.worker.name} size={46} />
          <View style={{ flex: 1 }}>
            <Text style={s.wName}>{job.worker.name}</Text>
            <Text style={s.wSub}>{job.worker.role}</Text>
          </View>
          <Pill text="Verified" tone="green" icon="shield-check" />
        </View>
      </Card>

      <Card style={{ marginTop: 14, alignItems: 'center' }}>
        <Text style={s.q}>How was your experience?</Text>
        <View style={{ marginTop: 12 }}><Stars value={rating} onChange={setRating} /></View>
        <Text style={s.word}>{WORDS[rating]}</Text>
        <View style={s.tags}>
          {TAGS.map((t) => {
            const on = tags.includes(t);
            return (
              <Pressable key={t} onPress={() => toggle(t)} style={[s.tag, on && s.tagOn]}>
                <Text style={[s.tagText, on && { color: colors.orange }]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ alignSelf: 'stretch', marginTop: 14 }}>
          <Input multiline icon="text-box-outline" placeholder="Write a short review (optional)" value={review} onChangeText={setReview} />
        </View>
      </Card>
    </Page>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 10, marginBottom: 12 },
  tick: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 25, fontWeight: '800', marginTop: 14 },
  sub: { color: '#AAB4C0', fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  worker: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  wSub: { color: colors.muted, fontSize: 12.5, marginTop: 2 },
  q: { color: colors.text, fontSize: 17, fontWeight: '700' },
  word: { color: '#FFB020', fontWeight: '700', marginTop: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14, justifyContent: 'center' },
  tag: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: '#2A323C', backgroundColor: '#12171E' },
  tagOn: { borderColor: colors.orange, backgroundColor: 'rgba(255,122,26,0.1)' },
  tagText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
});
