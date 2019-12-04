from engine import Engine
import time
import nuke


class NukeEngine(Engine):

    def open(self, path):
        """
        Open file
        """
        path = self.conform(path)
        nuke.scriptOpen(path)

    def open_as(self, path):
        """
        Open file and rename it with a time value
        for keep the source file
        """
        path = self.conform(path)
        nuke.scriptOpen(path)
        nuke.scriptSaveAs(path.replace(
            ".nk", "_{}.nk".format(time.time())))

    def save(self, path):
        """
        Save file as path
        """
        path = self.conform(path)
        nuke.scriptSaveAs(path)

    def get_ext(self):
        """
        Get the main extension
        """
        return ('.nk')

    def get_file_path(self):
        """
        Get the current file path (from the current open file)
        """
        return nuke.root().knob('name').value()

    def __str__(self):
        """
        Return the soft name
        """
        return 'nuke'


if __name__ == '__main__':
    """
    Test
    """
    # Create engine
    engine = NukeEngine()
    print ("Engine : " + str(engine))
    # Get engine path
    print ("Current file location : " + engine.get_file_path())
    # Save
    engine.save(r"C:\Users\Sylvain\Desktop\test" + engine.get_ext())
    print ("Current file location after save : " + engine.get_file_path())
    # Open as
    engine.open_as(engine.get_file_path())
    print ("Open as ")
    print ("Current file location after open as : " + engine.get_file_path())
    engine.save(engine.get_file_path())
    # Open
    engine.open(r"C:\Users\Sylvain\Desktop\test" + engine.get_ext())
    print ("Current file location after open : " + engine.get_file_path())
