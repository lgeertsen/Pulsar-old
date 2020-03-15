import sys
from Qt.QtWidgets import QMessageBox
from Qt import QtCore

class WarningMsg():
    """
    display a popup error box with a custom message
    """
    def __init__(self, _msg):
        self.msg_box = QMessageBox()
        self.msg_box.setWindowFlags(self.msg_box.windowFlags() | QtCore.Qt.WindowStaysOnTopHint)
        self.msg_box.setWindowTitle("Warning")
        self.msg_box.setIcon(QMessageBox.Warning)
        self.msg_box.setStandardButtons(QMessageBox.Ok)
        self.msg_box.setText(_msg)
        self.msg_box.exec_()

class Error(Exception):
    """
    Basic exeption class
    """

    def __init__(self, msg):
        self.msg_box = QMessageBox()
        self.msg_box.setWindowFlags(self.msg_box.windowFlags() | QtCore.Qt.WindowStaysOnTopHint)
        self.msg_box.setWindowTitle("Error")
        self.msg_box.setIcon(QMessageBox.Critical)
        self.msg_box.setStandardButtons(QMessageBox.Ok)
        self.msg_box.setText(msg)
        self.msg_box.exec_()


class NoSelectionError(Error):
    """
    Raised when the user don't select a file needed
    """

    def __init__(self):
        self.msg_box = QMessageBox()
        self.msg_box.setWindowFlags(self.msg_box.windowFlags() | QtCore.Qt.WindowStaysOnTopHint)
        self.msg_box.setWindowTitle("Error")
        self.msg_box.setIcon(QMessageBox.Critical)
        self.msg_box.setStandardButtons(QMessageBox.Ok)
        self.msg_box.setText("Select a file !")
        self.msg_box.exec_()


class FileNotValid(Error):
    """
    Raised when the file can't be open
    """

    def __init__(self):
        self.msg_box = QMessageBox()
        self.msg_box.setWindowFlags(self.msg_box.windowFlags() | QtCore.Qt.WindowStaysOnTopHint)
        self.msg_box.setWindowTitle("Error")
        self.msg_box.setIcon(QMessageBox.Warning)
        self.msg_box.setStandardButtons(QMessageBox.Ok)
        self.msg_box.setText("File selected not valid")
        self.msg_box.exec_()


class SidNotValid(Error):
    """
    Raised when the file can't be open
    """
    def __init__(self):
        self.msg_box = QMessageBox()
        self.msg_box.setWindowFlags(self.msg_box.windowFlags() | QtCore.Qt.WindowStaysOnTopHint)
        self.msg_box.setWindowTitle("Error")
        self.msg_box.setIcon(QMessageBox.Warning)
        self.msg_box.setStandardButtons(QMessageBox.Ok)
        self.msg_box.setText("Sid not valid")
        self.msg_box.exec_()




class PipeException(Exception):
    pass

class PopUpError(Error):
    """
    display a popup error box with a custom message
    """
    def __init__(self, _msg):
        self.msg_box = QMessageBox()
        self.msg_box.setWindowFlags(self.msg_box.windowFlags() | QtCore.Qt.WindowStaysOnTopHint)
        self.msg_box.setWindowTitle("Error")
        self.msg_box.setIcon(QMessageBox.Critical)
        self.msg_box.setStandardButtons(QMessageBox.Ok)
        self.msg_box.setText(_msg)
        self.msg_box.exec_()

class PopUpWarning(Error):
    """
    display a popup error box with a custom message
    """
    def __init__(self, _msg):
        self.msg_box = QMessageBox()
        self.msg_box.setWindowFlags(self.msg_box.windowFlags() | QtCore.Qt.WindowStaysOnTopHint)
        self.msg_box.setWindowTitle("Warning")
        self.msg_box.setIcon(QMessageBox.Warning)
        self.msg_box.setStandardButtons(QMessageBox.Ok)
        self.msg_box.setText(_msg)
        self.msg_box.exec_()

class PopUpInfo(Error):
    """
    display a popup error box with a custom message
    """
    def __init__(self, _msg):
        self.msg_box = QMessageBox()
        self.msg_box.setWindowFlags(self.msg_box.windowFlags() | QtCore.Qt.WindowStaysOnTopHint)
        self.msg_box.setWindowTitle("Info")
        self.msg_box.setIcon(QMessageBox.Information)
        self.msg_box.setStandardButtons(QMessageBox.Ok)
        self.msg_box.setText(_msg)
        self.msg_box.exec_()
