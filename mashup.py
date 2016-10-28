import json, music21, learn, sys
from music21 import *
from viterbi import viterbi

BIG_BOY = 99999

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def simpleMash(song1, song2):
	s = music21.stream.Score(id='mainScore')
	#s2Parts = song2.getElementsByClass('Part')
	#s.insert(0, song1.parts[0])
	#s.insert(0, song2.parts[1])
	mel = song1.parts[0]
	chords = song2.chordify()
	chord = chords.getElementsByOffset(0)
	for el in mel.recurse().notes:
		noteClass = el.pitch.pitchClass
		offset = el.offset
		newChord = chords.getElementsByOffset(offset)
		count = 0
		for n in newChord.recurse().notes:
			for note in n.pitches:
				count = count + 1
				break;
		if(count > 1):
			chord = newChord
		diff = 0;
		for n in chord.recurse().notes:
			for note in n.pitches:
				chordNote = note.pitchClass
				if(abs(chordNote - noteClass) < diff):
					diff = chordNote - noteClass
				if(diff == 0):
					diff = chordNote - noteClass
		el.transpose(diff, inPlace=True)
	s.insert(0, mel)
	count = 0
	for part in song2.parts:
		if(count > 0):
			s.insert(part)
		count = count + 1
	s.show()
	return s

def chordString(chord):
	notelist = []
	for ch in chord.recurse().getElementsByClass('Chord'):
		for pitch in ch.pitches:
			notelist.append(pitch.pitchClass)
	notelist.sort()
	result = str(list(set(notelist))) # conver list -> set -> list to remove duplicates
	return result

def findClosestChord(chords, offsetList, offset):
	if offset in offsetList:
		return chordString(chords.getElementsByOffset(offset))
	lastOffset = 0
	for num in offsetList:
		if num < offset:
			lastOffset = num
		else:
			break
	return chordString(chords.getElementsByOffset(lastOffset))

def makeOffsetList(chords):
	result = []
	result.append(0)
	for chord in chords.recurse().getElementsByClass('Chord'):
		offset = chord.offset
		if(offset > 0):
			result.append(offset)
	return result


def generateWindows(windowSize, melody, chords):
	chordified = chords.chordify()
	chordOffsetList = makeOffsetList(chordified)
	output = []
	counter = 0
	current = {}
	notes = []
	chordList = []
	numWindows = len(melody.notes) / windowSize
	for note in melody.recurse().notes:
		if counter <= windowSize:
			counter = counter + 1
			pitchClass = note.pitch.pitchClass
			octave = int(note.octave)
			val = pitchClass + (octave * 12)
			notes.append(val)
			chord = findClosestChord(chordified, chordOffsetList, note.offset)
			chordList.append(chord)
		else:
			current['notes'] = notes
			current['chords'] = chordList
			output.append(current)
			print('generating window ' + str(counter) + ' out of ' + str(len(output)))
			current = {}
			notes = []
			chordList = []
			pitchClass = note.pitch.pitchClass
			octave = int(note.octave)
			val = pitchClass + (octave * 12)
			notes.append(val)
			chord = findClosestChord(chordified, chordOffsetList, note.offset)
			chordList.append(chord)
			counter = 1
	if counter > windowSize:
		current['notes'] = notes
		current['chords'] = chordList
		output.append(current)
	return output

def litteralNote(note):
	pitchClass = note.pitch.pitchClass
	octave = int(note.octave)
	val = pitchClass + (octave * 12)
	return val


def getIntervals(melody):
	lastNote = BIG_BOY
	intervals = []
	for note in melody.recurse().notes:
		if lastNote != BIG_BOY:
			thisNote = litteralNote(note)
			interval = thisNote - lastNote
			intervals.append(interval)
		lastNote = litteralNote(note)
	return intervals

def intervalsDiff(intervalList, startingNote):
	result = []
	acc = 0
	for interval in intervalList:
		result.append(startingNote + acc)
		acc = acc + interval
	return result


def mash(song1, song2):
	learn.start()
	noteChordPairs = {}
	intervals = {}
	with open('output.json') as data_file:
		data = json.load(data_file)
		noteChordPairs = data['noteChordPairs']
		intervals = data['intervals']
	s = music21.stream.Score(id='mainScore')
	melody = song1.parts[0].flat
	chords = song2.parts[1].flat
	windowSize = 8
	print('generating windows')
	windows = generateWindows(windowSize, melody, chords) #generates list or lists od size = windowSize {note, chord, offset}
	windowIndex = -1
	windowOffset = windowSize
	chordList = []
	notes = []
	possibleIntervals = []
	intervalList =[]
	firstNote = litteralNote(melody.notes[0])
	for note in melody.recurse().notes:
		try:
			if (windowOffset >= windowSize):
				windowOffset = 0
				windowIndex = windowIndex + 1
				chordList = windows[windowIndex]['chords']
				notes = windows[windowIndex]['notes']
				firstNote = litteralNote(note)
				possibleIntervals = map(int, list(intervals.keys()))
				print('running viterbi on segment ' + str(windowIndex) + ' out of ' + str(len(windows)))
				intervalList = viterbi(chordList, notes, 0, firstNote, possibleIntervals, noteChordPairs, intervals)
				diffs = intervalsDiff(intervalList, firstNote)
			diff = diffs[windowOffset]
			note.transpose(diff - litteralNote(note), inPlace=True)
			windowOffset = windowOffset + 1
		except IndexError:
			break



	s.insert(0, melody)
	s.insert(0, chords)
	s.show()
	return s

def main():
    #get our data as an array from read_in()
    lines = read_in()
    song1_path = lines.get(u'song1')
    song2_path = lines.get(u'song2')
    destination = lines.get(u'destination')
    song1_parsed = music21.converter.parse(song1_path)
    song2_parsed = music21.converter.parse(song2_path)
    mashed = mash(song1_parsed,song2_parsed)
    SubConverter = music21.converter.subConverters.ConverterMidi()
    midi = SubConverter.write(mashed, 'mid', destination)

    #print midi

#start process
if __name__ == '__main__':
    main()

# to test run: cat pytest.txt | python mashup.py