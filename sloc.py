'''
    Count source-lines-of-code (SLOC) in project.

    Counts the total number of lines in all .java
    files. This includes white space and comments.
'''

import os
import glob

def file_len(fname):
    with open(fname) as f:
        for i, l in enumerate(f):
            pass
    return i + 1

def truncate(n, decimals=0):
    multiplier = 10 ** decimals
    return int(n * multiplier) / multiplier

sloc = 0
nfiles = 0
dir_tree = os.walk('.')



for entry in dir_tree:
    dir_list = entry[0][2:]
    path = dir_list
    print("path: " + path)
    if "node_modules" in path or "vscode" in path or "git" in path:
        print("continuing")
        continue
    for file_path in glob.glob('.\\' + path + '\*.js'):
        length = file_len(file_path)
        print('{} lines in {}'.format(length, file_path))
        #if "server.js" in file_path:
            #print(path)
        sloc += length
        nfiles += 1
    for file_path in glob.glob('.' + path + '\*.html'):
        length = file_len(file_path)
        print('{} lines in {}'.format(length, file_path))
        sloc += length
        nfiles += 1
    for file_path in glob.glob('.' + path + '\*.css'):
        length = file_len(file_path)
        print('{} lines in {}'.format(length, file_path))
        sloc += length
        nfiles += 1

avg = truncate(sloc/nfiles,1)

print('\n=========== SLOC ===========')
print('  {} lines in {} files'.format(sloc,nfiles))
print('  avg. file: {} lines'.format(avg))
print('============================')
