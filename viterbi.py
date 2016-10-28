
#chords given as list of strings representing chords
#notes given as list of ints representing literal pitches
#lastInterval given as int reptresents last observed interval
#startingPitchClass given as int representing pitch class of first note
#possibleIntervals given as list of ints representing all possible intervals
#noteChordPairs given as dictionary see learn.py for structure
#intervals given as dictionary see learn.py for structure

def viterbi(chords, notes, lastInterval, startingPitchClass, possibleIntervals, noteChordPairs, intervals):
	V = [{}]
	for st in possibleIntervals:
		intervalProbs = intervals[str(lastInterval)]
		intervalProb = any(d['value'] == st for d in intervalProbs)
		try:
			chordProbs = noteChordPairs[chords[0]]
			chordProb = any(d['value'] == (startingPitchClass + st + 48) % 12 for d in chordProbs)
		except KeyError:
			chordProb = 0
		V[0][st] = {'prob': intervalProb + chordProb, 'prev': None, 'pitch': startingPitchClass}
	# Run Viterbi when t > 0
	for t in range(1, len(chords)):
		V.append({})
		for st in possibleIntervals:
			max_tr_prob = max(V[t-1][prev_st]['prob'] + any(d['value'] == st for d in intervals[str(prev_st)]) for prev_st in possibleIntervals)
			for prev_st in possibleIntervals:
				if V[t-1][prev_st]['prob'] + any(d['value'] == st for d in intervals[str(prev_st)]) == max_tr_prob:
					try:
						chordProbs = noteChordPairs[chords[t]]
						chordProb = any(d['value'] == V[t-1][prev_st]['pitch'] for d in chordProbs)
					except KeyError:
						chordProbs = []
						chordProb = 0
					max_prob = max_tr_prob + chordProb
					V[t][st] = {'prob': max_prob, 'prev': prev_st, 'pitch': ((V[t-1][prev_st]['pitch'] + st + 48) % 12)}
					break
	opt = []
	# The highest probability
	max_prob = max(value['prob'] for value in V[-1].values())
	previous = None
	# Get most probable state and its backtrack
	for st, data in V[-1].items():
		if data['prob'] == max_prob:
			opt.append(st)
			previous = st
			break
	# Follow the backtrack till the first observation
	for t in range(len(V) - 2, -1, -1):
		opt.insert(0, V[t + 1][previous]['prev'])
		previous = V[t + 1][previous]['prev']
	print('The steps of states are ' + ' '.join(str(opt)) + ' with highest probability of %s' % max_prob)
	return opt