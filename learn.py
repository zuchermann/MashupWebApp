import os, json, sys, music21
from music21 import *
directory = "./corpus"
outPath = "output.json"

'''
*******************
STRUCTURE OF OUTPUT
*******************

{
	'intervals' :											bigrams of intervals in melodies
		{
			'0' : [											represents conditional interval; 0 is unison, 1 is half step, etc...
					{'value' : 0, 'prob' : 0.5},			means there is a 50% chance of a 0 interval following a 0 interval
					...
				  ],
			...
		}
	'noteChordPairs' :										probability of note being played over given chord
		{
			'[0, 5, 9]' : [									represent chord as list of pitch classes
							{'value' : 0, 'prob' : 0.5},	means note c (pitch class) has a 50% probability of being played over chord [0, 5, 9]
							...
						  ],
			...
		}
}
'''

def makeNoteList(melody):
	result = []
	for note in melody.recurse().notes:
		pitchClass = note.pitch.pitchClass
		octave = int(note.octave)
		val = pitchClass + (octave * 12)
		result.append(val)
	return result

def finalize(values):
	result = dict()
	for key in values:
		intervalList = values[key]
		final = []
		for interval in set(intervalList):
			prob = dict()
			prob['value'] = interval
			prob['prob'] = intervalList.count(interval)/float(len(intervalList))
			final.append(prob)
		result[key] = final
	return result

def learnIntervals(notelist, data):
	for i in range(len(notelist) - 1):
		if (i > 0):
			lastNote = notelist[i-1]
			thisNote = notelist[i]
			nextNote = notelist[i+1]
			lastInterval = str(thisNote - lastNote)
			nextInterval = nextNote - thisNote
			if (lastInterval in data['intervals']):
				data['intervals'][lastInterval].append(nextInterval)
			else:
				data['intervals'][lastInterval] = []
				data['intervals'][lastInterval].append(nextInterval)

def makeOffsetList(chords):
	result = []
	result.append(0)
	for chord in chords.recurse().getElementsByClass('Chord'):
		offset = chord.offset
		if(offset > 0):
			result.append(offset)
	return result

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

def findLastChord(offset, chords):
	chordified = chords.chordify()
	chordOffsetList = makeOffsetList(chordified)
	chord = findClosestChord(chordified, chordOffsetList, offset)
	return chord

def learnNoteChordPairs(melody, chords, data):
	chordified = chords.chordify()
	chordOffsetList = makeOffsetList(chordified)
	for note in melody.recurse().notes:
		nearestChord = findClosestChord(chordified, chordOffsetList, note.offset)
		if (nearestChord in data['noteChordPairs']):
			data['noteChordPairs'][nearestChord].append(note.pitch.pitchClass)
		else:
			data['noteChordPairs'][nearestChord] = []
			data['noteChordPairs'][nearestChord].append(note.pitch.pitchClass)

def learn(song, data):
	melody = song.parts[0].flat
	chords = song.parts[1].flat
	notelist = makeNoteList(melody)
	intervals = learnIntervals(notelist, data)
	noteChordPairs = learnNoteChordPairs(melody, chords, data)

def start():
	data = dict()
	numberOfFiles = len(os.listdir(directory))
	count = 0
	for filename in os.listdir(directory):
		if filename.endswith(".xml") or filename.endswith(".mid"):
			if(count == 0):
				data['intervals'] = {}
				data['noteChordPairs'] = {}
			parsed = music21.converter.parse(os.path.join(directory, filename))
			learn(parsed, data)
			count = count + 1
			print('learned '+ filename + ': ' + str(count) + ' out of ' + str(numberOfFiles))
			continue
		else:
			continue
	data['intervals'] = finalize(data['intervals'])
	data['noteChordPairs'] = finalize(data['noteChordPairs'])
	output(data)

def output(data):
	with open(outPath, 'w') as outfile:
		json.dump(data, outfile, sort_keys=True)