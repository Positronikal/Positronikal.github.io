<html>
    <head>
    </head>
    <body>
        <h1>Welcome to Positronikal on GitHub!</h1>
            <p>
                My real name is Hoyt Harness, but Positronikal is the moniker I've used for several years for my digital projects. The majority of projects I intend to park here pertain to digital forensics and cyber investigation. That said, there will likely also be projects that don't directly pertain to these subject matter areas. I'll continue to host public forks of other projects from my personal account at <a href="https://github.com/hoyt-harness">https://github.com/hoyt-harness</a>.
            </p>
        <h2>Projects:</h2>
            <p>
				<a href="https://github.com/Positronikal/libewf-legacy-win">ewf-tools for Windows AMD64</a>
				<blockquote>
					I forked the libyal/libewf-legacy repo, made all the necessary adjustments for a Windows AMD64 build using the included PowerShell scripts, upgraded the prerequisite files for Visual Studio 2022, built the supporting libraries and ewf-tools, then pushed the whole thing here. The README explains where the binaries are located and the original documentation details how to configure everything to build it yourself if you don't want to use the pre-builts. Otherwise, you can clone it or download the ZIP, add the appropriate path to your envars, and run the tools from any directory.
				</blockquote>
			</p>
			<p>
                <a href="https://github.com/Positronikal/CarnivoreLE">CarnivoreLE</a>
                <blockquote>
                    This repository has been deprecated as of December 31, 2020 and exists as a placeholder only. All Carnivore code released prior to this date pertaining specifically to CarnivoreLE or any other part of the larger project will continue to be licensed under GPLv3. No new changes or pull requests will be accepted.
                </blockquote>
            </p>
            <p>
                <a href="https://github.com/Positronikal/simpleBackup">simpleBackup</a>
                <blockquote>
					This is just as the name implies - a simple backup utility for Debian-based distros. It's written in bash and makes use of rsync and dialog. rsync is a fast, versatile, remote (and local) file copying tool. dialog displays dialog boxes from shell scripts. There is plenty of room to expand this project, add new dialog boxes, and make much more of rsync's capabilities. See the section below titled <cite>Contributing</cite>.
                </blockquote>
            </p>
            <p>
                <a href="https://github.com/Positronikal/montereyMacports">montereyMacports</a>
                <blockquote>
					These shell utilities work on Macintosh macOS 12 Monterey to either automate the installation of MacPorts or upgrade MacPorts if an installation for an earlier version of macOS exists. Both utilities must be ran from sudo and will create a ~/bin/MacPorts directory to work from. In addition, they install a third utility in ~/bin to automate MacPorts updating (macports_updater.sh). The updater also must be ran from root. The install/upgrade utilities add ~/bin to your path envar, so updater can simply be called from a terminal. Both the install/update utilities can be further improved by combining them into a single script that determines at runtime if MacPorts is (1) installed and already the current version, (2) is installed, but not the current version, or (3) is not installed, then calling the appropriate functionality from there. Contributors/testers may find other areas of improvement. See the section below titled <cite>Contributing</cite>.
                </blockquote>
            </p>
        <h2>Contributing:</h2>
            <p>
                If you're new and not sure where to begin, GitHub's <a href="https://help.github.com/">Help</a> pages are a good place to start. There are also quick start and setup information pages located in <a href="https://help.github.com/categories/bootcamp/">Bootcamp</a> and <a href="https://help.github.com/categories/setup">Setup</a>.
            </p>
            <p>
                All commits in pull requests must be GPG signed. I know, I know... Positronikal is nobody. You're right, but better to start off the right way than to try and backtrack something months or years down the road. It's not as much of a pain as it sounds like and you know this if you're doing it already. If not, see the page on <a href="https://help.github.com/articles/signing-commits-with-gpg">signing commits</a>. Use of a keyserver is highly recommended, as is having your public key signed by others who can vouch for you. Instructions on this are <a href="https://www.gnupg.org/gph/en/manual/x457.html">here</a>. My public key (Hoyt Harness) can be retrieved from MIT's keyserver <a href="https://pgp.mit.edu/">here</a>.
            </p>
            <p>
                All contributors must have a signed Developer Certificate of Origin on file with Positronikal before any code is accepted or reviewed. This is related to the above paragraph and for the same reasons. If the code you submitted was written as a result of your job or you coded a significant portion during work hours or if any other circumstances exist that might give rise to your employer exercising a right to ownership at any time in the future, a DCO must be on file for them as well and signed by a competent authority within the organization (not yourself). Posi_DCO.md is available in this repository. Click the "View On GitHub" button at the top of the page to find it or click <a href="https://github.com/Positronikal/Positronikal.github.io">here</a>.
            </p>
            <p>
                Positronikal coding tends to follow <a href="https://www.gnu.org/prep/standards/">GNU coding standards</a>. Software development tends to follow the <a href="http://catb.org/esr/writings/taoup/html/">UNIX philosphy</a>. Information contained at both of those links are invaluable to new coders and should still contain worthy nuggets of wisdom for even the most experienced. In any case, all disputes regarding form or function will ultimately be resolved based on one of those references.
            </p>

        <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.

        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-102603475-3"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-102603475-3');
        </script>

    </body>
</html>
